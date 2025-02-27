import React, { useEffect, useContext } from "react";
import { UserContent } from "./useContext/UserContent";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import Swal from "sweetalert2";

export default function PedidosNuevos() {
  const { orden, setOrden } = useContext(UserContent);

  useEffect(() => {
    const getDatos = async () => {
      const data = await getDocs(collection(db, "Pedidos"));
      data.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const arrayPedidos = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrden(arrayPedidos);
      });
    };

    getDatos();
  }, [setOrden]);

  const refresh = () => {
    setTimeout(function () {
      window.location.reload();
    }, 2000);
  };

  const changeStatusListo = async (id) => {
    try {
      const orderDoc = doc(db, "Pedidos", id);
      const newStatus = { status: "Listo" };
      const newColor = { style: "green" };

      await Swal.fire({
        title: "¿El pedido está listo?",
        text: "Confirma la acción",
        imageUrl: "https://c.tenor.com/77__ESdB10oAAAAd/popeye-food.gif",
        imageWidth: 200,
        imageHeight: 130,
        showCancelButton: true,
        confirmButtonColor: "#C5F2ED",
        cancelButtonColor: "#EC683B",
        confirmButtonText: "Entregar",
      }).then((result) => {
        if (result.isConfirmed === true) {
          Swal.fire("Pedido listo");
          updateDoc(orderDoc, newStatus, newColor);
        }
      });
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminar = async (id) => {
    try {
      await Swal.fire({
        title: "Se cerrará el pedido",
        text: "Confirma la acción",
        imageUrl: "https://c.tenor.com/ensMLnR7_-gAAAAC/sad-burger.gif",
        imageWidth: 200,
        imageHeight: 130,
        showCancelButton: true,
        confirmButtonColor: "#C5F2ED ",
        cancelButtonColor: " #EC683B",
        confirmButtonText: "Cerrar pedido",
      }).then((result) => {
        if (result.isConfirmed === true) {
          Swal.fire("Pedido cerrado!", "Se almacenó en la BD");

          deleteDoc(doc(db, "Pedidos", id));
          const arrayFiltrado = orden.filter((item) => item.id !== id);
          setOrden(arrayFiltrado);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="cont-menu">
      <div className="background-mesa-cocina2">
        <table className="tablePedidos">
          <tbody>
            <tr>
              {orden.map((item) => (
                <th key={item.id} className="thPedidos">
                  <div className="contentPedidos">
                    <section className="sectionPedidos1">
                      <span
                        onClick={() => eliminar(item.id)}
                        className="x-delete"
                      >
                        <strong> X </strong>
                      </span>
                      <span>
                        <strong>Cliente: </strong>
                        {item.Cliente}
                      </span>
                      <span style={{ color: "red" }}>
                        <strong>Status: </strong>
                        {item.status}
                      </span>
                      <span>
                        <strong>Hora: </strong>
                        {item.dateOrder.toDate().toLocaleTimeString()}
                      </span>
                    </section>
                    <section className="sectionPedidos2">
                      {item.Pedido.map((item) => (
                        <div
                          className="card text-white bg-warning mb-3"
                          id="cocina2"
                          key={item.id}
                        >
                          <p className="spanPedido">
                            {item.cant} {item.name}
                          </p>
                        </div>
                      ))}
                      <button
                        onClick={() => changeStatusListo(item.id)}
                        className="btnEntrega"
                      >
                        Entregar
                      </button>
                    </section>
                  </div>
                </th>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
