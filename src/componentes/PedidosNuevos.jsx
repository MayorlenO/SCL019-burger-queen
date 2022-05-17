import React, {useEffect, useContext} from "react"
import { UserContent } from "./useContext/UserContent";
import { addDoc, collection, getDocs, updateDoc, doc, Timestamp, deleteDoc} from "firebase/firestore"
import {db} from '../firebase-config'




export default function PedidosNuevos (){
    const { orden, setOrden } = useContext(UserContent);
    const { cliente, setCliente } = useContext(UserContent);
    const { cart, setCart } = useContext(UserContent);
    

    useEffect(() => {
        
        const getDatos = async () => {
            
        const data = await getDocs(collection(db, "Pedidos"))
        data.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            const arrayPedidos = data.docs.map(doc => ({ id: doc.id, ...doc.data()}))
            setOrden(arrayPedidos)
        })
        }

        getDatos()
    }, [setOrden])

    const changeStatus = async (id) => {
        const orderDoc = doc(db, "Pedidos", id);
        const newStatus= { status: "Listo"}
        await updateDoc(orderDoc, newStatus);
        window.location.reload(false);
        
      };

      const sendToCaja = async () => {
        
        try {
          const docRef = await addDoc(collection(db, "Caja"), {
            Pedido: orden,
            dateOrder: Timestamp.fromDate(new Date()),
            
          });
         alert('Pedido se enviará a caja')
         window.location.reload(false)
         console.log(docRef);
        } catch (e) {
          console.log("error", e);
        }
        setCliente("");
        setOrden([]);
        
      };
    

      const eliminar = async (id) => {
        try {
          await deleteDoc(doc(db, "Pedidos", id));
          const arrayFiltrado = orden.filter(item => item.id !== id)
          setOrden(arrayFiltrado)
          alert('¿Está seguro que desea eliminar el pedido?')
          window.location.reload(false)
        } catch (error) {
          console.log(error)
        }
    }
  
  
    
    const itemsPrice = cart.reduce((a, c) => a + c.cant * c.price, 0);

return (
    
    <div className="cont-menu">
    <div  className="background-mesa-cocina2">
         <table  className="tablePedidos">
                <tbody>
                <tr>
        
        {
            orden.map(item => (
                
               <th key={item.id} className="thPedidos">
               <div className="contentPedidos" >
                      <section className="sectionPedidos1">
                      <span onClick={()=> eliminar(item.id)} className="x-delete"><strong> X </strong></span>    
                      <span><strong>Cliente: </strong>{item.Cliente}</span>
                      <span><strong>Status: </strong>{item.status}</span>
                      <span><strong>Hora: </strong>{item.dateOrder.toDate().toLocaleTimeString()}</span>
                      </section>
                      <section className="sectionPedidos2">
                      {
                          
                          item.Pedido.map(item => (
                             
                            <div className="card text-white bg-warning mb-3" id="cocina2" key={item.id}>
                             <p className="spanPedido">{item.cant} {item.name} {item.price}{item.badge}</p>
                             
                        </div>
                        
                               
                            ))           
                        }
        <button onClick={()=> changeStatus(item.id)} className="btnEntrega" >Entregar</button>
        <button onClick={()=> sendToCaja(item.id)} className="btnArchivo" >Enviar a Caja</button>
           </section>
           </div>
           </th>
          
           
            ))
                    }
                     </tr>
          </tbody>
           </table>
                    
        </div>
        </div>
)
}

    
