import React from 'react';

import logo from '../../assets/logo.svg';
import * as S from './styles';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <S.Container>
      <S.Content>
        <img src={logo} alt="logo ecoleta" />
        <h1>{title}</h1>
      </S.Content>
    </S.Container>
  );
};

export default Header;
