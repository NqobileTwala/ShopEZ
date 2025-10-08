import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { ref, set, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const user = auth.currentUser;

  const addToCart = async () => {
    if(!user) return alert('User not logged in');

    const cartRef = ref(db, 'carts/' + user.uid + '/' + product.id);

    onValue(cartRef, snapshot => {
      const currentQty = snapshot.val()?.quantity || 0;
      set(cartRef, {...product, quantity: currentQty + 1});
    }, {onlyOnce:true});

    try {
      const storedCart = await AsyncStorage.getItem('cart_'+user.uid);
      let cart = storedCart ? JSON.parse(storedCart) : {};
      cart[product.id] = {...product, quantity: (cart[product.id]?.quantity || 0)+1};
      await AsyncStorage.setItem('cart_'+user.uid, JSON.stringify(cart));
    } catch(err){ console.log(err); }

    alert('Added to cart!');
  };

  return (
    <View style={{padding:20}}>
      <Image source={{uri:product.image}} style={{width:150,height:150,alignSelf:'center'}} />
      <Text style={{fontSize:18,fontWeight:'bold',marginVertical:10}}>{product.title}</Text>
      <Text style={{marginBottom:10}}>{product.description}</Text>
      <Text style={{fontSize:16,fontWeight:'bold',marginBottom:20}}>${product.price}</Text>
      <Button title="Add to Cart" onPress={addToCart} />
    </View>
  );
}
