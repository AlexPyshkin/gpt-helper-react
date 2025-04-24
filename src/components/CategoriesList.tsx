import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries';
import { List, ListItem, ListItemText, CircularProgress, Typography } from '@mui/material';

export const CategoriesList = ({ onSelectCategory, currentState }) => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <List>
      {data.categories.map((category) => (
        <ListItem 
          button 
          key={category.id} 
          onClick={() => onSelectCategory(category)}
          selected={currentState.category && currentState.category.id === category.id}
          sx={{
            backgroundColor: currentState.category && currentState.category.id === category.id ? 'lightblue' : 'inherit',
          }}
        >
          <ListItemText primary={category.name} />
        </ListItem>
      ))}
    </List>
  );
}; 