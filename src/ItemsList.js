import React from 'react';
import { supabase } from './supabaseClient';

function ItemsList({ items, onItemsChange }) {
  const deleteItem = async (id) => {
    const { data, error } = await supabase
      .from('items')
      .delete()
      .match({ id });
    if (error) console.error("error", error);
    else onItemsChange(); // Refresh items list
  };

  // Update functionality can be implemented similarly,
  // by creating another component for editing an item and passing the update function.

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.id} - {item.name} - {item.description} - {item.quantity}
          <button onClick={() => deleteItem(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default ItemsList;
