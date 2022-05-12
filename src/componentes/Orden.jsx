import React, { useContext } from "react";
import { UserContent } from './useContext/UserContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';





const Orden = () => {
  const { cart, setCart } = useContext(UserContent);
  const itemsPrice = cart.reduce((a, c) => a + c.cant * c.price, 0);



  const deleteProduct = (id) => {
    const existProducts = cart.find((item) => item.id === id);
    if (existProducts.cant === 1) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === id
          ? { ...existProducts, cant: existProducts.cant - 1 }
            : item
        )
      )
    }
  }


    
  return (
  
    <section>
      <table className="table">
        <thead>
          <input type="text" placeholder="Cliente" className="form-control"></input>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Precio</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        {cart.map(item => {
          return (
            <tbody>
              <tr>
                <th scope="row">{item.name}</th>
                <td> {item.cant}</td>
                <td> {item.price}</td>
                <td> 
                <FontAwesomeIcon icon={faTrash}

                onClick={() => deleteProduct(item.id) } id="iconoDelete" key={item.id} />
                   </td>
              </tr>
            </tbody>
            
          )
          
        })}
        

      </table>

      <section className="tfoot">
            <p className="result"></p>
            <p colSpan="2"> Total</p>
            <p>
              {" "}
              <strong>${parseFloat(itemsPrice).toFixed(2)}</strong>{" "}
              
            </p>
          </section>


    </section>
  );
      
};
  
export default Orden;