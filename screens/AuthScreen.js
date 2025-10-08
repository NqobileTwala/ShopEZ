import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!email || !password) { setError('Enter your email and password'); return; }
    try { await createUserWithEmailAndPassword(auth, email, password); } 
    catch (err) { setError(err.message); }
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Enter your email and password'); return; }
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (err) { setError(err.message); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{screen === 'login' ? 'Login' : 'Register'}</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {screen === 'login' ? 
        <>
          <Button title="Login" onPress={handleLogin} />
          <Text style={styles.switch} onPress={()=>{setScreen('register'); setError('');}}>Go to Register</Text>
        </> :
        <>
          <Button title="Register" onPress={handleRegister} />
          <Text style={styles.switch} onPress={()=>{setScreen('login'); setError('');}}>Go to Login</Text>
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1,justifyContent:'center',padding:20},
  title: {fontSize:24,marginBottom:20,textAlign:'center'},
  input: {borderWidth:1,padding:10,marginBottom:10,borderRadius:5},
  error: {color:'red',marginBottom:10},
  switch: {color:'blue',marginTop:10,textAlign:'center'}
});
