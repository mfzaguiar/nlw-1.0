import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  whatsapp: Yup.string().required('Whatsapp obrigatório'),
  uf: Yup.string().required('Selecione o estado').min(2, 'Selecione um estado'),
  city: Yup.string()
    .required('Selecione a cidade')
    .min(2, 'Selecione uma cidade'),
  coords: Yup.array(Yup.number().notOneOf([0], 'Selecione um ponto no mapa'))
    .test('Min test', 'Deve conter latitude e longitude', function (item) {
      let totalAmount = item.length;
      return totalAmount === 2;
    })
    .required('Selecione um ponto no mapa'),
  items: Yup.array()
    .min(1, 'Selecione um item de coleta')
    .required('Selecione um item de coleta'),
});

export default schema;
