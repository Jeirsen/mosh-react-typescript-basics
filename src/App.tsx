import { useEffect, useState } from "react";
import useUsers from "./hooks/useUsers";
import { CanceledError } from "./services/api-client";
import UserService, { User } from "./services/user-service";
import Alert from "./components/Alert";
import Button from "./components/Button";
import Form from "./components/Form";
import ListGroup from "./components/ListGroup";
import ExpenseFilter from "./expense-tracker/components/ExpenseFilter";
import ExpenseForm from "./expense-tracker/components/ExpenseForm";
import ExpenseList from "./expense-tracker/components/ExpenseList";

function App() {
  // let items = ["New York", "Berlin", "London", "Tokyo", "Moscu", "Paris"];
  // const [showAlert, setShowAlert] = useState(false);
  // const handleSelectItem = (item: string) => {
  //   console.log(item);
  // };

  const [expenses, setExpenses] = useState([
    { id: 1, description: "aaa", amount: 10, category: "Groceries" },
    { id: 2, description: "vbbb", amount: 10, category: "Utilities" },
    { id: 3, description: "ccc", amount: 10, category: "Utilities" },
    { id: 4, description: "fggff", amount: 10, category: "Entertainment" },
    { id: 5, description: "asadaaa", amount: 10, category: "Entertainment" },
  ]);
  const [selectedCategory, setSelectCategory] = useState("");

  const visibleExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses;

  //custom hook
  const { users, error, isLoading, setUsers, setError } = useUsers();

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));
    UserService.delete(user.id).catch((e) => {
      setError(e.message);
      setUsers(originalUsers);
    });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = { ...user, name: user.name + "!" };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    UserService.update(updatedUser).catch((e) => {
      setError(e.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: "Jeirsen" };
    setUsers([newUser, ...users]);
    UserService.craete(newUser)
      .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
      .catch((e) => {
        setError(e.message);
        setUsers(originalUsers);
      });
  };

  return (
    <div className="container">
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border" />}
      <button className="btn btn-primary" onClick={addUser}>
        Add
      </button>
      {!isLoading && (
        <ul className="list-group">
          {users.map((user) => (
            <li
              key={user.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {user.name}
              <div>
                <button
                  className="btn btn-outline-secondary mx-1"
                  onClick={() => updateUser(user)}
                >
                  Update
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => deleteUser(user)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* <ListGroup
        items={items}
        heading="World Cities"
        onSelectItem={handleSelectItem}
      />
      {showAlert && (
        <Alert onClose={() => setShowAlert(false)}>
          Primary <span>Alert</span>
        </Alert>
      )}
      <Button onClick={() => setShowAlert(true)}>My Button</Button> 
      <Form />*/}
      <div className="mt-3 mb-3">
        <ExpenseForm
          onSubmit={(expense) =>
            setExpenses([...expenses, { ...expense, id: expenses.length + 1 }])
          }
        />
      </div>
      <div className="mt-3 mb-3">
        <ExpenseFilter
          onSelectCategory={(category) => setSelectCategory(category)}
        />
      </div>

      <ExpenseList
        expenses={visibleExpenses}
        onDelete={(id) => setExpenses(expenses.filter((e) => e.id !== id))}
      />
    </div>
  );
}

export default App;
