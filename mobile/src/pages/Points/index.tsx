import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import * as Location from 'expo-location';

import * as S from './styles';

import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Ops',
          'Precisamos de sua permissão para obter a localização'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    }
    loadPosition();
  }, []);

  useEffect(() => {
    api
      .get('points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        },
      })
      .then((response) => {
        setPoints(response.data);
      });
  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id });
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <>
      <S.Container>
        <S.StyledButton onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color={'#34cb79'} />
        </S.StyledButton>

        <S.Title>Bem vindo.</S.Title>
        <S.Description>Encontre no mapa um ponto de coleta.</S.Description>

        <S.MapContainer>
          {initialPosition[0] !== 0 && (
            <S.Map
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map((point) => (
                <S.MapMarker
                  key={String(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() => handleNavigateToDetail(point.id)}
                >
                  <S.MapMarkerContainer>
                    <S.MapMarkerImage
                      source={{
                        uri: point.image,
                      }}
                      resizeMode="cover"
                    />
                    <S.MapMarkerTitle>{point.name}</S.MapMarkerTitle>
                  </S.MapMarkerContainer>
                </S.MapMarker>
              ))}
            </S.Map>
          )}
        </S.MapContainer>
      </S.Container>
      <S.ItemsContainer
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {items.map((item) => (
          <S.Item
            active={selectedItems.includes(item.id)}
            key={String(item.id)}
            onPress={() => handleSelectedItem(item.id)}
            activeOpacity={0.6}
          >
            <S.ItemImage width={42} height={42} uri={item.image_url} />
            <S.ItemTitle>{item.title}</S.ItemTitle>
          </S.Item>
        ))}
      </S.ItemsContainer>
    </>
  );
};
export default Points;
