import {useQuery, useMutation} from '@apollo/client';
import {GET_LIBRARY_CATEGORIES, CREATE_CATEGORY} from '../../graphql/queries';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Typography,
    Box,
    Collapse,
    IconButton,
    TextField,
    Button,
    Paper
} from '@mui/material';
import {AppState, Category} from '../../types';
import {useState} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import AddIcon from '@mui/icons-material/Add';

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
    const { user } = useAuth();
    const {loading, error, data} = useQuery(GET_LIBRARY_CATEGORIES, {
        variables: { email: user?.email || '' }
    });
    const { t } = useTranslation();
    
    const [newCategoryName, setNewCategoryName] = useState('');
    const [createCategory, { loading: creatingCategory }] = useMutation(CREATE_CATEGORY, {
        refetchQueries: [{ query: GET_LIBRARY_CATEGORIES, variables: { email: user?.email || '' } }]
    });

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            await createCategory({
                variables: {
                    categoryText: newCategoryName.trim(),
                    parentId: currentState.category?.id || null
                }
            });
            setNewCategoryName('');
        } catch (err) {
            console.error('Error creating category:', err);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleCreateCategory();
        }
    };

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
            {/* Форма создания категории - отображается только в режиме редактирования */}
            {currentState.filters.editMode && (
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: 'background.default',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px'
                    }}
                >
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                        {t('library.createCategory')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                            size="small"
                            placeholder={t('library.categoryNamePlaceholder')}
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={creatingCategory}
                            sx={{ flexGrow: 1 }}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleCreateCategory}
                            disabled={!newCategoryName.trim() || creatingCategory}
                            startIcon={<AddIcon />}
                        >
                            {creatingCategory ? <CircularProgress size={16} /> : t('common.add')}
                        </Button>
                    </Box>
                </Paper>
            )}

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