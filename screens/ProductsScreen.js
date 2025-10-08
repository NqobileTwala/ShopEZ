import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Button, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(()=>{
    fetch('https://fakestoreapi.com/products')
      .then(res=>res.json())
      .then(data=>{ setProducts(data); setLoading(false); })
      .catch(err=>{ console.log(err); setLoading(false); });

    fetch('https://fakestoreapi.com/products/categories')
      .then(res=>res.json())
      .then(data=>setCategories(data))
      .catch(err=>console.log(err));
  }, []);

  const filterProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : products;

  if(loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" /><Text>Loading products...</Text></View>;

  return (
    <View style={{flex:1}}>
      <View style={{flexDirection:'row', flexWrap:'wrap'}}>
        <Button title="All" onPress={()=>setSelectedCategory('')} />
        {categories.map(cat => <Button key={cat} title={cat} onPress={()=>setSelectedCategory(cat)} />)}
      </View>

      <FlatList
        data={filterProducts}
        keyExtractor={item=>item.id.toString()}
        contentContainerStyle={{padding:10}}
        renderItem={({item})=>(
          <TouchableOpacity style={{flexDirection:'row',alignItems:'center',borderWidth:1,padding:10,marginBottom:10,borderRadius:5}} onPress={()=>navigation.navigate('Detail',{product:item})}>
            <Image source={{uri:item.image}} style={{width:50,height:50,marginRight:10}} />
            <View style={{flex:1}}>
              <Text numberOfLines={1}>{item.title}</Text>
              <Text>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
