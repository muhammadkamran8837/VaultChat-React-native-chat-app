import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";

const NewsCard = ({ item }) => {
  return (
    <View style={{ flex: 1, marginBottom: 30, gap: 5 }}>
      <Image
        style={{
          width: "100%",
          height: 200,
          borderRadius: 3,
        }}
        source={{
          uri: item.urlToImage
            ? item.urlToImage
            : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png",
        }}
      />

      <View style={{ display: "flex", gap: 5 }}>
        <Text
          style={{ fontWeight: "bold", fontSize: 18, color: "rgb(55 65 81)" }}
        >
          {item.title}
        </Text>
        <Text style={{ fontSize: 14, color: "rgb(55 65 81)" }}>
          {item.description}
        </Text>
        <Text style={{ fontSize: 14, color: "rgb(55 65 81)" }}>
          Author: {item.author ? item.author : "Author"}
        </Text>
        <Text style={{ fontSize: 14, color: "rgb(55 65 81)" }}>
          {item.publishedAt.toLocaleString()}
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 16, color: "#3D737F" }}>
          {item.source.name}
        </Text>
      </View>
      <Pressable
        style={{
          backgroundColor: "#3D737F",
          alignSelf: "flex-start",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 4,
          marginTop: 5,
        }}
      >
        <Text
          style={{
            color: "white",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          Read More
        </Text>
      </Pressable>
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({});
