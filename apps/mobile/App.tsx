import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import VerifyOtpScreen from "./src/screens/VerifyOtpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

import CreateEventScreen from "./src/screens/events/CreateEventScreen";
import MyEventsScreen from "./src/screens/events/MyEventsScreen";
import ScanQrScreen from "./src/screens/events/ScanQrScreen";
import CreateEventFormScreen from "./src/screens/events/CreateEventFormScreen";
import EditEventScreen from "./src/screens/events/EditEventScreen";

import BrowseEventsScreen from "./src/screens/events/BrowseEventsScreen";
import MyRegistrationsScreen from "./src/screens/events/MyRegistrationsScreen";

import { api } from "./src/api/client";
import { getToken, removeToken } from "./src/storage/authStorage";
import EventDetailsScreen from "./src/screens/events/EventDetailsScreen";
import DevoteeEventDetailsScreen from "./src/screens/events/DevoteeEventDetailsScreen";
import DailyProgressScreen from "./src/screens/progress/DailyProgressScreen";
import ProgressHistoryScreen from "./src/screens/progress/ProgressHistoryScreen";
import JournalListScreen from "./src/screens/content/JournalListScreen";
import NewsletterListScreen from "./src/screens/content/NewsletterListScreen";
import ContentDetailsScreen from "./src/screens/content/ContentDetailsScreen";
import TripsScreen from "./src/screens/trips/TripsScreen";
import TripDetailsScreen from "./src/screens/trips/TripDetailsScreen";
import CreateTripScreen from "./src/screens/trips/CreateTripScreen";
import EditTripScreen from "./src/screens/trips/EditTripScreen";
import MyCreatedTripsScreen from "./src/screens/trips/MyCreatedTripsScreen";
import RegisteredTripsScreen from "./src/screens/trips/RegisteredTripsScreen";
import EventRegistrationManageScreen from "./src/screens/events/EventRegistrationManageScreen";
import EventUserRegistrationsScreen from "./src/screens/events/EventUserRegistrationsScreen";
import CoursesScreen from "./src/screens/courses/CoursesScreen";
import CourseDetailsScreen from "./src/screens/courses/CourseDetailsScreen";
import CreateCourseScreen from "./src/screens/courses/CreateCourseScreen";
import EditCourseScreen from "./src/screens/courses/EditCourseScreen";
import MyCreatedCoursesScreen from "./src/screens/courses/MyCreatedCoursesScreen";
import RegisteredCoursesScreen from "./src/screens/courses/RegisteredCoursesScreen";
import CourseRegistrationManageScreen from "./src/screens/courses/CourseRegistrationManageScreen";
import CourseRegistrationsScreen from "./src/screens/courses/CourseRegistrationsScreen";
import TripRegistrationsScreen from "./src/screens/trips/TripRegistrationsScreen";
import TripRegistrationManageScreen from "./src/screens/trips/TripRegistrationManageScreen";
import DonateScreen from "./src/screens/DonateScreen";
import FestivalCalendarScreen from "./src/screens/FestivalCalendarScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyOtp: any;
  Home: undefined;
  Profile: undefined;

  CreateEvent: undefined;
  MyEvents: undefined;
  ScanQr: undefined;
  CreateEventForm: { eventUuid: string; mode?: "create" | "edit" };
  EditEvent: { eventUuid: string };

  BrowseEvents: undefined;
  MyRegistrations: undefined;
  EventDetails: { eventUuid: string };
  EventRegistrationManage: undefined;
  EventUserRegistrations: { eventUuid: string };
  DevoteeEventDetails: { eventUuid: string };
  DailyProgress: undefined;
  ProgressHistory: undefined;
  Journals: undefined;
  Newsletters: undefined;
  ContentDetails: { uuid: string };
  Trips: undefined;
  TripDetails: { uuid: string };
  CreateTrip: undefined;
  EditTrip: { uuid: string };
  MyCreatedTrips: undefined;
  RegisteredTrips: undefined;
  Courses: undefined;
  CourseDetails: { uuid: string };
  RegisteredCourses: undefined;

  CreateCourse: undefined;
  EditCourse: { uuid: string };
  MyCreatedCourses: undefined;
  CourseRegistrationManage: undefined;
  CourseRegistrations: { uuid: string };
  TripRegistrationManage: undefined;
  TripRegistrations: { uuid: string };
  Donate: undefined;
  FestivalCalendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function ProtectedScreen({
  component: Component,
  navigation,
  route,
  user,
  allowedRoles = [],
}: any) {
  const roles =
    user?.user_roles?.map((ur: any) => ur?.role?.name?.toUpperCase()) || [];

  const hasAccess =
    allowedRoles.length === 0 ||
    allowedRoles.some((role: string) => roles.includes(role));

  useEffect(() => {
    if (!user) {
      navigation.replace("Login");
    }
  }, [user]);

  if (!hasAccess) {
    Alert.alert("Access denied", "You are not allowed to access this page.");
    navigation.replace("Home");
    return null;
  }

  return <Component navigation={navigation} route={route} />;
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>("Login");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();

      if (!token) {
        setInitialRoute("Login");
        return;
      }

      const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setInitialRoute("Home");
    } catch (error) {
      await removeToken();
      setUser(null);
      setInitialRoute("Login");
    } finally {
      setAuthLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#c2410c" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />

        <Stack.Screen name="Home">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={HomeScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={ProfileScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateEvent">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={CreateEventScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MyEvents">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={MyEventsScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ScanQr">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={ScanQrScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateEventForm">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={CreateEventFormScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="EditEvent">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={EditEventScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="BrowseEvents">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={BrowseEventsScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["SEEKER"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MyRegistrations">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={MyRegistrationsScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["SEEKER"]}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="EventDetails">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={EventDetailsScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["SEEKER"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="DevoteeEventDetails">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={DevoteeEventDetailsScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="DailyProgress">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={DailyProgressScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ProgressHistory">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={ProgressHistoryScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Journals">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={JournalListScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Newsletters">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={NewsletterListScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ContentDetails">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={ContentDetailsScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Trips">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={TripsScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="TripDetails">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={TripDetailsScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateTrip">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={CreateTripScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="EditTrip">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={EditTripScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MyCreatedTrips">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={MyCreatedTripsScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisteredTrips">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={RegisteredTripsScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="EventRegistrationManage">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={EventRegistrationManageScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="EventUserRegistrations">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={EventUserRegistrationsScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>
        {/* Course screens - seeker + devotee both */}
        <Stack.Screen name="Courses">
          {(props) => (
            <ProtectedScreen {...props} component={CoursesScreen} user={user} />
          )}
        </Stack.Screen>

        <Stack.Screen name="CourseDetails">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={CourseDetailsScreen}
              user={user}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisteredCourses">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={RegisteredCoursesScreen}
              user={user}
            />
          )}
        </Stack.Screen>

        {/* Course screens - only devotees/admin */}
        <Stack.Screen name="CreateCourse">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={CreateCourseScreen}
              user={user}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="EditCourse">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={EditCourseScreen}
              user={user}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MyCreatedCourses">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={MyCreatedCoursesScreen}
              user={user}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CourseRegistrationManage">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={CourseRegistrationManageScreen}
              user={user}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CourseRegistrations">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={CourseRegistrationsScreen}
              user={user}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="TripRegistrationManage">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={TripRegistrationManageScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="TripRegistrations">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={TripRegistrationsScreen}
              user={user}
              setUser={setUser}
              allowedRoles={["DEVOTEE", "ADMIN"]}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Donate">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={DonateScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="FestivalCalendar">
          {(props) => (
            <ProtectedScreen
              {...props}
              component={FestivalCalendarScreen}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
