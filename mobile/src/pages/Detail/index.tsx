import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';

import * as S from './styles';

import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    id: number;
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then((response) => {
      setData(response.data);
    });
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    });
  }

  function handleWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse na coleta`
    );
  }

  if (!data.point) {
    return null;
  }

  return (
    <S.Container>
      <S.Wrapper>
        <S.StyledButton onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color={'#34cb79'} />
        </S.StyledButton>

        <S.PointImage
          source={{
            uri: data.point.image,
          }}
        />
        <S.PointName>{data.point.name}</S.PointName>
        <S.PointItems>
          {data.items.map((item) => item.title).join(', ')}
        </S.PointItems>

        <S.Adress>
          <S.AdressTitle>Endereço</S.AdressTitle>
          <S.AdressContent>
            {data.point.city} - {data.point.uf}
          </S.AdressContent>
        </S.Adress>
      </S.Wrapper>
      <S.Footer>
        <S.Button onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <S.ButtonText>Whatsapp</S.ButtonText>
        </S.Button>
        <S.Button onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#fff" />
          <S.ButtonText>E-mail</S.ButtonText>
        </S.Button>
      </S.Footer>
    </S.Container>
  );
};

export default Detail;
