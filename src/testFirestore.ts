import { db } from "./firebase";

async function testFirestore() {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.limit(5).get(); 

    if (snapshot.empty) {
      console.log(" Nincsenek termékek a Firestore-ban!");
      return;
    }

    snapshot.forEach((doc) => {
      console.log(`🛍 Termék ID: ${doc.id} ->`, doc.data());
    });

    console.log(" Firestore kapcsolat működik!");
  } catch (error) {
    console.error(" Hiba a Firestore kapcsolat tesztelése közben:", error);
  }
}

testFirestore();
