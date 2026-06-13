import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { api } from "../api/client";
import { getToken, removeToken } from "../storage/authStorage";

function ProtectedScreen({
  component: Component,
  navigation,
  route,
  user,
  setUser,
  allowedRoles = [],
}: any) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verifyAccess = async () => {
      try {
        let currentUser = user;

        if (!currentUser) {
          const token = await getToken();

          if (!token) {
            setTimeout(() => {
              navigation.replace("Login");
            }, 0);
            return;
          }

          const res = await api.get("/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          currentUser = res.data;
          setUser(res.data);
        }

        const roles =
          currentUser?.user_roles?.map((ur: any) =>
            ur?.role?.name?.toUpperCase()
          ) || [];

        const hasAccess =
          allowedRoles.length === 0 ||
          allowedRoles.some((role: string) =>
            roles.includes(role.toUpperCase())
          );

        if (!hasAccess) {
          Alert.alert("Access denied", "You are not allowed to access this page.");

          setTimeout(() => {
            navigation.replace("Home");
          }, 0);

          return;
        }

        if (mounted) {
          setAllowed(true);
        }
      } catch (error) {
        await removeToken();

        setTimeout(() => {
          navigation.replace("Login");
        }, 0);
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    };

    verifyAccess();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (!allowed) {
    return null;
  }

  return <Component navigation={navigation} route={route} />;
}

export default ProtectedScreen;