import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import Dropzone from '../../components/Dropzone';
import logo from '../../assets/logo.svg';
import * as S from './styles';

import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    async function handleLoadItems() {
      api.get('items').then((response) => {
        setItems(response.data);
      });
    }

    handleLoadItems();
  }, []);

  useEffect(() => {
    async function handleLoadUfs() {
      axios
        .get<IBGEUFResponse[]>(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
        )
        .then((response) => {
          const ufInitials = response.data.map((uf) => uf.sigla);
          setUfs(ufInitials);
        });
    }

    handleLoadUfs();
  }, []);

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      )
      .then((response) => {
        const cityName = response.data.map((city) => city.nome);
        setCities(cityName);
      });
  }, [selectedUF]);

  function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUF(uf);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    selectedFile && data.append('image', selectedFile);

    await api.post('points', data);

    history.push('/');
  }

  return (
    <S.Container>
      <header>
        <Link to="/">
          <img src={logo} alt="Ecoleta" />
        </Link>
        <Link to="/">
          <FiArrowLeft />
          Voltar
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {selectedPosition && <Marker position={selectedPosition} />}
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUF}
                onChange={handleSelectedUF}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                className={selectedItems.includes(item.id) ? 'selected' : ''}
                key={item.id}
                onClick={() => handleSelectedItem(item.id)}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </S.Container>
  );
};

export default CreatePoint;
