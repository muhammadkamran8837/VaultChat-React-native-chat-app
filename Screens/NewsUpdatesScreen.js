import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";

const NewsUpdatesScreen = () => {
  const [newsUpdates, setNewsUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const getNewsUpdates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=73e259d205944fec81007936259b8881`
      );
      const newsDetails = response.data.articles;
      setNewsUpdates(newsDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news updates:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getNewsUpdates();
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={"#3D737F"} size={36} />
        </View>
      ) : (
        <View style={{ flex: 1, marginHorizontal: 20, paddingVertical: 10 }}>
          <FlatList
            data={newsUpdates}
            keyExtractor={(item, index) => item.url + index}
            renderItem={({ item }) => <NewsCard item={item} />}
            refreshing={loading}
            onRefresh={getNewsUpdates}
          />
        </View>
      )}
    </>
  );
};

export default NewsUpdatesScreen;

const styles = StyleSheet.create({});
