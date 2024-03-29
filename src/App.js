import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ItemsList from './ItemsList';
import AddItemForm from './AddItemForm';

function App() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*');
    if (error) console.error("error", error);
    else setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h1>My Items</h1>
      <AddItemForm onNewItem={fetchItems} />
      <ItemsList items={items} onItemsChange={fetchItems} />
    </div>
  );
}

export default App;
