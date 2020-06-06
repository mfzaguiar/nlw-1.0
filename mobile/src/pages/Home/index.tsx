import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

const Home = () => {
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const navigation = useNavigation();

  function handleNavigationToPoints() {
    navigation.navigate('Points', {
      uf,
      city,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <S.Container
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
      >
        <S.Main>
          <S.Logo source={require('../../assets/logo.png')} />
          <S.Title>Seu marketplace de coleta de resíduos</S.Title>
          <S.Description>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficientes.
          </S.Description>
        </S.Main>

        <S.Footer>
          <S.StyledTextInput
            placeholder="Digite a UF"
            value={uf}
            onChangeText={setUf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <S.StyledTextInput
            placeholder="Digite a cidade"
            value={city}
            onChangeText={setCity}
            autoCorrect={false}
          />

          <S.StyledButton onPress={handleNavigationToPoints}>
            <S.ButtonIcon>
              <Icon name="arrow-right" size={20} color="#fff" />
            </S.ButtonIcon>
            <S.TextButton>Entrar</S.TextButton>
          </S.StyledButton>
        </S.Footer>
      </S.Container>
    </KeyboardAvoidingView>
  );
};

export default Home;
