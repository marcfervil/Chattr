import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Animated } from 'react-native';
import Login from "./Login";
import Record from "./Record";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Network from "./network";

const Stack = createNativeStackNavigator();
const network = new Network();


export default function App() {
	//Stack.Navigator.nav
    return (
		<NavigationContainer>
			<Stack.Navigator>
				
				<Stack.Screen
					name="Login"
					component={Login}
					initialParams={{network}}
					options={{ title: 'Welcome' }}
				/>
				<Stack.Screen
					name="Record"
					component={Record}
					initialParams={{network}}
					options={{ title: 'Record' }}
				/>

			</Stack.Navigator>
		</NavigationContainer>
  	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
