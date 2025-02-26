import { getFirestore, collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "./firebase"; // Saját Firebase inicializációs fájlod

const fetchProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      console.log(`Termék ID: ${doc.id}`, doc.data());
    });
  } catch (error) {
    console.error("Hiba a termékek lekérésekor:", error);
  }
};

fetchProducts();
