import React, {useEffect, useState} from 'react';
import { Button} from 'react-native';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
//import { onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from './screens/AuthScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  if (loading) return null;
  if (!user) return <AuthScreen/>

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Products" component={ProductsScreen} options={{
          headerRight: () => <Button title="Logout" color="dodgerblue" onPress={() => signOut(auth)} />,
            headerLeft: () => <Button title="Cart" color="dodgerblue" onPress={() => navigationRef.current?.navigate('Cart')} />,
            title: 'ShopEZ Products'
        }}/>
        <Stack.Screen name="Detail" component={ProductDetailScreen} options={{title: 'Product Detail'}}/>
        <Stack.Screen name="Cart" component={CartScreen} options={{title: 'Your Cart'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}