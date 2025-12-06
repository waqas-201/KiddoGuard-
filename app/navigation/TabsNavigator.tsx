import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KidsTab from '../screens/tabs/KidsTab';
import SettingsTab from '../screens/tabs/SettingsTab';

const Tab = createBottomTabNavigator();

export default function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#1c261e", // same as kid cards
                    borderTopColor: "#29382c",
                },
                tabBarActiveTintColor: "#00e054",
                tabBarInactiveTintColor: "#a0b8a4",
            }


            }
        >
            <Tab.Screen name="KidsTab" component={KidsTab} options={{ title: "Kids" }} />
            <Tab.Screen name="SettingsTab" component={SettingsTab} options={{ title: "Settings" }} /> 
        </Tab.Navigator>
    );
}