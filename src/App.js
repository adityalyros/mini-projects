// import React, { useState, useEffect } from 'react';
// import Form from './components/Form';
// import TodoList from './components/TodoList';
// import Alert from './components/Alert';
// import Title from './components/Title';

// const App = () => {

//   const [formInput, setFormInput] = useState("");
//   const [todoList, setTodoList] = useState([]);
//   const [alert, setAlert] = useState({status: false, message: "", type: ""});
//   const [isEditing, setIsEditing] = useState({status:false, id:""});

//   const submitHandler = (comingTodo) => {
//     setTodoList([...todoList, comingTodo]);
//     setAlert({ status:true, message:"Item Added", type:"success" });
//   }

//   const deleteTodo = (id) => {
//     const newTodoList = todoList.filter((eachTodo) => {
//       return eachTodo.id !== id;
//     })
//     setTodoList(newTodoList);
//     setAlert({ status:true, message:"Item Deleted", type:"danger" });
//     setIsEditing({ id:"", status:false});
//     setFormInput("")
//   }

//   const updateTodo = (newTodo) => {
//     const newTodoList = todoList.map((eachTodo) => {
//       if(eachTodo.id === newTodo.id){
//         eachTodo.message = newTodo.message
//       }
//       return eachTodo;
//     })
//     setTodoList(newTodoList);
//     setIsEditing({ id:"", status:false});
//     setAlert({ status:true, message:"Item Updated", type:"success" });
//   }

//   const clearTodoList = () => {
//     setAlert({ status:true, message:"Items Deleted", type:"danger" });
//     setTodoList([]);
//   }

//   useEffect(() => {
//     if(localStorage.getItem("todoList")){
//       const newList = JSON.parse(localStorage.getItem("todoList"));
//       setTodoList(newList);
//       return;
//     }
//   }, []);
  

//   useEffect(() => {
//     localStorage.setItem("todoList", JSON.stringify(todoList));
//   }, [todoList]);
  

//   return (
//     <>
//       <main className='section'>
//         <div className="main-container section-center">
//           <Title />
//           {
//             alert.status && <Alert setAlert={setAlert} message={alert.message} type={alert.type}/>
//           }
//           <Form formInput={formInput} setFormInput={setFormInput} submitHandler={submitHandler} isEditing={isEditing} updateTodo={updateTodo} setAlert={setAlert}/>
//           <TodoList todoList={todoList} deleteTodo={deleteTodo} updateTodo={updateTodo} setIsEditing={setIsEditing} setFormInput={setFormInput}/>
//           {
//             (todoList.length > 0) && <div className="clear-items">
//             <button className="clear-btn" onClick={clearTodoList}>clear todos</button>
//           </div>
//           }
//         </div>
//       </main>
//     </>
//   );
// }

// export default App;

import React, { Component } from "react";
import "./styles/app.scss";
import Signin from "./Components/Login";
import Register from "./Components/Register";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Products from "./Components/Products";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Cart from "./Components/Cart";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mainCartItems: [],
    };
  }

  allSelectedProducts = (comingState, sameItem) => {
    if (sameItem === "sameItem") {
      let newList = this.state.mainCartItems.filter(
        (obj) => obj.id !== comingState.id
      );
      newList.push(comingState);
      this.setState({
        mainCartItems: newList,
      });
    } else {
      this.setState({
        mainCartItems: [...this.state.mainCartItems, comingState],
      });
    }
  };

  updateCartItemCount = (type, prodId) => {
    if (type === "increase") {
      let data = [...this.state.mainCartItems];
      let currentItem = data.find((obj) => obj.id === prodId);
      if (currentItem.stock > 0) {
        currentItem.quantity = currentItem.quantity + 1;
        currentItem.totalPrice = currentItem.totalPrice + currentItem.unitPrice;
        currentItem.stock = currentItem.stock - 1;

        let newList = data.filter((obj) => obj.id !== currentItem.id);
        newList.push(currentItem);
        this.setState({
          mainCartItems: newList,
        });
      } else {
        toast.warn("You reached Maximum Limit!");
      }
    } else {
      let data = [...this.state.mainCartItems];
      let currentItem = data.find((obj) => obj.id === prodId);
      currentItem.quantity = currentItem.quantity - 1;
      currentItem.totalPrice = currentItem.totalPrice - currentItem.unitPrice;
      currentItem.stock = currentItem.stock + 1;

      let newList = data.filter((obj) => obj.id !== currentItem.id);
      currentItem.quantity > 0 && newList.push(currentItem);
      if (currentItem.quantity <= 0) {
        toast.warn(
          "Item Removed, If you want to add item click on Products/Start Shopping!"
        );
      }
      this.setState({
        mainCartItems: newList,
      });
    }
  };

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          {/* <Navbar mainCartItems={this.state.mainCartItems} /> */}
          <Route
            path="/"
            render={(props) => (
              <Navbar {...props} mainCartItems={this.state.mainCartItems} />
            )}
          />
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Register} />
            <Route path="/home" component={Home} />
            <Route
              path="/products"
              render={(props) => (
                <Products
                  {...props}
                  allSelectedProducts={this.allSelectedProducts}
                  mainCartItems={this.state.mainCartItems}
                />
              )}
            />
            <Route
              path="/cart"
              render={(props) => (
                <Cart
                  {...props}
                  mainCartItems={this.state.mainCartItems}
                  updateCartItemCount={this.updateCartItemCount}
                />
              )}
            />
            {/* <Route path="/cart" component={Cart} /> */}
          </Switch>
          <Footer />
        </BrowserRouter>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          transition={Slide}
        />
      </div>
    );
  }
}

export default App;