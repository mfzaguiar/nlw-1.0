import React, { useState, useEffect, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import Dropzone from '../../components/Dropzone';
import logo from '../../assets/logo.svg';
import * as S from './styles';

import api from '../../services/api';
import pointSchema from '../../helpers/schema/point';

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

interface Point {
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  coords: [number, number];
  items: number[];
  file: File;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUF, setSelectedUF] = useState('0');
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

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleSelectedItem(id: number, setValue: Function) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
      setValue('items', filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
      setValue('items', [...selectedItems, id]);
    }
  }

  const onSubmit = async (data: Point) => {
    const { name, email, whatsapp, uf, city, file, coords, items } = data;
    const dataPoint = new FormData();

    dataPoint.append('name', name);
    dataPoint.append('email', email);
    dataPoint.append('whatsapp', whatsapp);
    dataPoint.append('uf', uf);
    dataPoint.append('city', city);
    dataPoint.append('latitude', String(coords[0]));
    dataPoint.append('longitude', String(coords[1]));
    dataPoint.append('items', items.join(','));
    selectedFile && dataPoint.append('image', file);

    await api.post('points', dataPoint);

    history.push('/');
  };

  const { register, handleSubmit, setValue, errors, control } = useForm<Point>({
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      uf: '0',
      city: '0',
      coords: [0, 0],
      items: [],
      file: undefined,
    },
    validationSchema: pointSchema,
  });

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>

        <Controller
          name="file"
          as={<Dropzone onFileUploaded={setSelectedFile} setValue={setValue} />}
          control={control}
        />
        {errors.file && <p>Selecione uma imagem</p>}

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input id="name" name="name" type="text" ref={register} />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" ref={register} />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" ref={register} />
              {errors.whatsapp && <p>{errors.whatsapp.message}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <div className="map">
            <Controller
              name="coords"
              as={Map}
              control={control}
              center={initialPosition}
              zoom={15}
              onclick={(event: LeafletMouseEvent) => {
                setValue('coords', [event.latlng.lat, event.latlng.lng]);
                handleMapClick(event);
              }}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {selectedPosition && <Marker position={selectedPosition} />}
            </Controller>
            {errors.coords && <p>{errors.coords[0].message}</p>}
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                onChange={(e) => {
                  setValue('uf', e.target.value);
                  handleSelectedUF(e);
                }}
                ref={register}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
              {errors.uf && <p>{errors.uf.message}</p>}
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                onChange={(e) => setValue('city', e.target.value)}
                ref={register}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && <p>{errors.city.message}</p>}
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
              <Controller
                key={item.id}
                name="items"
                as={
                  <li>
                    <img src={item.image_url} alt={item.title} />
                    <span>{item.title}</span>
                  </li>
                }
                control={control}
                onClick={() => {
                  handleSelectedItem(item.id, setValue);
                }}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              />
            ))}
          </ul>
          {errors.items && <p>Selecione um item</p>}
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </S.Container>
  );
};

export default CreatePoint;
