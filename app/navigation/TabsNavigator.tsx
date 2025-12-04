import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KidsTab from '../screens/tabs/KidsTab';

const Tab = createBottomTabNavigator();

export default function Tabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="KidsTab" component={KidsTab} />
            {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
        </Tab.Navigator>
    );
}