import {useQuery} from '@apollo/client';
import {GET_CATEGORIES} from '../graphql/queries';
import {List, ListItem, ListItemButton, ListItemText, CircularProgress, Typography, Box} from '@mui/material';
import {AppState, Category} from '../types';

type CategoriesListProps = {
    onSelectCategory: (category: Category) => void;
    currentState: AppState;
};

export const CategoriesList = ({onSelectCategory, currentState}: CategoriesListProps) => {
    const {loading, error, data} = useQuery(GET_CATEGORIES);

    if (loading) return <CircularProgress/>;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '6px',
                margin: '6px',
                backgroundColor: '#f9f9f9',
                height: 'calc(100% - 32px)',
                overflowY: 'auto',
            }}
        >
            <List>
                {data.categories.map((category: Category) => (
                    <ListItem disablePadding key={category.id}>
                        <ListItemButton
                            onClick={() => onSelectCategory(category)}
                            selected={currentState.category?.id === category.id}
                            sx={{
                                backgroundColor:
                                    currentState.category?.id === category.id ? 'lightblue' : 'inherit',
                            }}
                        >
                            <ListItemText primary={category.name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}; 