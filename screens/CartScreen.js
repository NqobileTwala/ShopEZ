import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Button } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { ref, onValue, update, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen() {
  const [cart, setCart] = useState({});
  const user = auth.currentUser;

  useEffect(()=>{
    if(!user) return;
    const cartRef = ref(db, 'carts/' + user.uid);
    const unsubscribe = onValue(cartRef, snapshot => {
      if(snapshot.exists()){
        setCart(snapshot.val());
        AsyncStorage.setItem('cart_'+user.uid, JSON.stringify(snapshot.val()));
      } else {
        AsyncStorage.getItem('cart_'+user.uid).then(stored=>{
          if(stored) setCart(JSON.parse(stored));
        });
      }
    });
    return ()=> unsubscribe();
  }, []);

  const changeQty = (id, delta) => {
    const newQty = (cart[id].quantity || 0) + delta;
    if(newQty <= 0) {
      const updated = {...cart}; delete updated[id]; setCart(updated); set(ref(db,'carts/'+user.uid+'/'+id), null); return;
    }
    const updated = {...cart,[id]:{...cart[id],quantity:newQty}};
    setCart(updated);
    set(ref(db,'carts/'+user.uid+'/'+id), updated[id]);
  };

  const total = Object.values(cart).reduce((sum,p)=>sum+p.price*p.quantity,0);

  return (
    <View style={{flex:1,padding:10}}>
      <FlatList
        data={Object.values(cart)}
        keyExtractor={item=>item.id.toString()}
        renderItem={({item})=>(
          <View style={{flexDirection:'row',alignItems:'center',borderWidth:1,padding:10,marginBottom:10,borderRadius:5}}>
            <Image source={{uri:item.image}} style={{width:50,height:50,marginRight:10}} />
            <View style={{flex:1}}>
              <Text numberOfLines={1}>{item.title}</Text>
              <Text>Qty: {item.quantity}</Text>
              <Text>Subtotal: ${(item.price*item.quantity).toFixed(2)}</Text>
              <View style={{flexDirection:'row'}}>
                <Button title="+" onPress={()=>changeQty(item.id,1)} />
                <Button title="-" onPress={()=>changeQty(item.id,-1)} />
              </View>
            </View>
          </View>
        )}
      />
      <Text style={{fontSize:18,fontWeight:'bold'}}>Total: ${total.toFixed(2)}</Text>
    </View>
  );
}
