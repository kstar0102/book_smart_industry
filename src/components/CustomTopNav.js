import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import images from "../assets/images";

const { height } = Dimensions.get("window");

const CustomTopNav = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { key: "Home", icon: "📅" },
    { key: "Staff", icon: "👥" },
    { key: "Shifts", icon: "⚙️" },
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.logoContainer}>
        <Image source={images.logo} resizeMode="contain" style={styles.logoImage} />
        <Text style={styles.title}>Team Scheduler</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map(({ key }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, selectedTab === key && styles.activeTab]}
            onPress={() => setSelectedTab(key)}
          >
            <Text style={[styles.tabText, selectedTab === key && styles.activeTabText]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  navContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#7A8A91",
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
    marginTop: height * 0.15,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 12,
  },
  tab: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#6E7E86",
    borderRadius: 8,
    flexDirection: "row",
  },
  tabText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default CustomTopNav;
