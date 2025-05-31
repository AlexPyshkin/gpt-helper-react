import {useQuery} from '@apollo/client';
import {GET_LIBRARY_CATEGORIES} from '../../graphql/queries';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Typography,
    Box,
    Collapse,
    IconButton
} from '@mui/material';
import {AppState, Category} from '../../types';
import {useState} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';

type CategoriesListProps = {
    onSelectCategory: (category: Category) => void;
    currentState: AppState;
};

const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map of all categories
    categories.forEach(category => {
        categoryMap.set(category.id, {...category, children: []});
    });

    // Second pass: build tree structure
    categories.forEach(category => {
        const categoryWithChildren = categoryMap.get(category.id)!;
        if (category.parentId) {
            const parent = categoryMap.get(category.parentId);
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(categoryWithChildren);
            }
        } else {
            rootCategories.push(categoryWithChildren);
        }
    });

    // Sort categories at each level
    const sortCategories = (cats: Category[]): Category[] => {
        return cats
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(cat => ({
                ...cat,
                children: cat.children ? sortCategories(cat.children) : []
            }));
    };

    return sortCategories(rootCategories);
};

const CategoryTreeItem = ({category, level = 0, onSelectCategory, currentState}: {
    category: Category;
    level?: number;
    onSelectCategory: (category: Category) => void;
    currentState: AppState;
}) => {
    const [open, setOpen] = useState(true);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <>
            <ListItem
                disablePadding
                key={category.id}
                sx={{pl: level * 2}}
            >
                <ListItemButton
                    onClick={() => onSelectCategory(category)}
                    selected={currentState.category?.id === category.id}
                    sx={{
                        backgroundColor:
                            currentState.category?.id === category.id ? 'lightblue' : 'inherit',
                    }}
                >
                    {hasChildren && (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(!open);
                            }}
                        >
                            {open ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        </IconButton>
                    )}
                    <ListItemText primary={category.name}/>
                </ListItemButton>
            </ListItem>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {category.children!.map((child) => (
                            <CategoryTreeItem
                                key={child.id}
                                category={child}
                                level={level + 1}
                                onSelectCategory={onSelectCategory}
                                currentState={currentState}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

export const CategoriesList = ({onSelectCategory, currentState}: CategoriesListProps) => {
    const {loading, error, data} = useQuery(GET_LIBRARY_CATEGORIES);
    const { t } = useTranslation();

    if (loading) return <CircularProgress/>;
    if (error) return <Typography color="error">{t('common.error')}: {error.message}</Typography>;

    const categoryTree = buildCategoryTree(data.categories);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '6px',
                margin: '6px',
                backgroundColor: 'background.paper',
                minHeight: '50px',
                height: '70%',
                overflowY: 'auto',
            }}
        >
            <List>
                {categoryTree.map((category) => (
                    <CategoryTreeItem
                        key={category.id}
                        category={category}
                        onSelectCategory={onSelectCategory}
                        currentState={currentState}
                    />
                ))}
            </List>
        </Box>
    );
}; 