import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function AddItemForm({ onNewItem }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  const addItem = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('items')
      .insert([{ id, name, description, quantity }]);
    if (error) console.error("error", error);
    else {
      setId('');
      setName('');
      setDescription('');
      setQuantity('');
      onNewItem(); // Refresh items list
    }
  };

  return (
    <form onSubmit={addItem}>
      <input
        type="int"
        placeholder="Id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="varchar"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="int"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button type="submit">Add Item</button>
    </form>
  );
}

export default AddItemForm;
