# Inventory Management System v2

<sub>*last updated: 2024-03-26*</sub>
<br>
<sub>*comments: React.js with Supabase*</sub>

This example is a React.js application that performs read, create, and delete operations against a Supabase database. Let's dive into these steps one by one.

## Step 1: Setting Up Supabase

### 1. Create a Supabase Account and Project:

- Go to Supabase and sign up or log in.
- Once logged in, click on "New Project".
- Provide a name for your project, choose the nearest region to your users for the best performance, and set a secure password.

### 2. Create a Table:

- After your project is created, go to the "Table Editor" from the left sidebar in the Supabase dashboard.
- Click on "New Table" and create **Items** table for your app.
- Add columns according to the data you want to store.
    - id *int*
    - name *varchar* 
    - description *text*
    - quantity *int*
- Set the id column as the primary key and enable auto-increment

### 3. Get Supabase Keys:

- Go to the **Project Settings > API** section in your project dashboard.
- Here, you'll find your *Project URL* and *anon/public keys*. You'll need these to connect your React app to Supabase.

## Step 2: Setting Up React Application

### 1. Create a React App:

```bash
npx create-react-app inventory-management
cd inventory-management
```

### 2. Install Supabase Client:

```bash
npm install @supabase/supabase-js
```

### 3. Configure Supabase:
- Create a file named *.env.local* in your project's root directory.
- Add your Supabase URL and keys like this:

```
REACT_APP_SUPABASE_URL='Your_Supabase_Project_URL'
REACT_APP_SUPABASE_ANON_KEY='Your_Supabase_Anon_Key'
```

### 4. Initialize Supabase Client:

- Create a file *supabaseClient.js* in the **src** folder.
- Initialize Supabase client like this:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 5. Modify App component (/src/App.js):
- This is your main component where we'll use state hooks to store our items and display other components.
- We'll fetch items from Supabase when the component mounts using the 'useEffect' hook.

```jsx
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
```

### 6. Create AddItemForm Component (/src/AddItemForm.js):

- A component to add new items.
- It includes a form with inputs for the item's fields, and a button to submit the form.
- The onNewItem function passed from App.js is called after adding an item to refresh the list.

```jsx
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
```

### 7. Create ItemsList Component (/src/ItemsList.js):

- Displays a list of items.
- Each item has buttons for updating and deleting it, using the corresponding functions.

```jsx
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
```

### 8. Finalize and Run Your App

- Ensure all components are correctly imported and used in your **App.js**.
- Start your development server with 'npm start'.
- You should now see your items fetched from Supabase displayed on the page, and you can add or delete items. To implement update functionality, you might create an *'EditItemForm'* component similar to *'AddItemForm'* but pre-filled with the item's current data and with a function to update the item in Supabase.

This setup provides a basic read, create, delete application using React and Supabase. For a more sophisticated application, you may need to handle loading states, error messages, and form validations.