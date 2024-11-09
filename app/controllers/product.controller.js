import { Product } from "../models/product.model.js";
import logger from "../utils/logger.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "No hay eso que buscar bro" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

//vamos a crear un servicio para traer un producto por id
const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "No hay eso que buscas bro" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

//vamos a crear un seer isio par delete un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .send({ message: "No hay eso que buscas borrar bro" });
    }
    res.jason({ message: "Eliminao" });
  } catch (error) {
    res.status(500).send(error);
  }
};
//?price=500&sort=price&limit=10&page=1
const findProductsByFilters = async (req, res) => {
  try {
    let queryObject = { ...req.query };
    console.log(queryObject);

    //para apñicar un filtro al price

    const withOutFiles = ["page", "sort", "limit", "fields"];
    withOutFiles.forEach((field) => delete queryObject[field]);
    console.log(queryObject);

    //{price: 500}
    //vamosa  reemplazar los operadores por su sintais habitual para usarlos en la consulta.
    //vamos a trasformar el obejtoa un string para reemplazar ,os operadoes
    let stringQuery = JSON.stringify(queryObject);
    stringQuery = stringQuery.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryObject = JSON.parse(stringQuery);

    //"price, title" (esto es lo que tenemos) tenenos que llegar a "price title" (sincoma)
    let sort = "";
    if (req.query.sort) {
      sort = req.query.sort.split(",").join(" ");
    }

    let selected = "";
    if (req.query.fields) {
      selected = req.query.fields.split(",").join(" ");
    }

    //vamos a definir la paginacion
    //skip-> saltar elementos
    //es la cantidad de elementos que vamosa a mostrar por pagina
    //pagina = 1, limit = 10, skip = 0, (10 primeros elementos)
    //pagina =2, limit = 10, skip = 10, (10 primeros elementos)
    //pagina =3, limit = 10, skip = 20, (10 primeros elementos)

    let limit = req.query.limit || 100;
    let page = req.query.page || 1;
    let skip = (page - 1) * limit;

    //el sort puede recibir como parametro  "price title"
    const products = await Product.find(queryObject)
      .select(selected)
      .sort(sort)
      .limit(limit)
      .skip(skip);
    res.json(products);
    //const products = await Product.find({price: 500})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//siempr es recomendable hacer el procesamiento (como filtrados) q nivel de base de datos
const getProductsStatistics = async (req, res) => {
  try {
    //Vamos a añadir nuestra agregacion
    //El primer paso es un match ->el paso donde vamos a filtrar ,os documentos
    //vamos a definir los pasos de nuestro pipeline (es la ejecucion de una secuencia de pasos)

    const statistics = await Product.aggregate([
      //PRIMER PASO match: el resultado de este paso sirve como datos de entrada del paso siguiente
      {
        $match: { price: { $gte: 5 } },
      },
      //SEGUNDO PASO es procesar los documentos para resolver un proceso complejo.
      //vamos a agrupar todos los productos y vamos a hacer lo siguiente:
      //1.- Vamos a contar cuantos productos hay en total.
      //2.- Vamos a calcular el precio promedio de nuestros productos.
      //3.- Vamos a obtener el precio minimo.
      //4.- Vamoas a obtener el precio maximo.
      {
        $group: {
          //para poder definir cual es la condicion de agrupamiento usamos el atributo _id
          //vamos a agrupar todos los productos _id = null
          //_id: null,
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      //TERCER PASO es ordenar (aplicar un ordenamiento)
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProducts,
  saveProduct,
  updateProduct,
  getOneProduct,
  deleteProduct,
  findProductsByFilters,
  getProductsStatistics,
};
//Los controladores lo que van a haer es analisar el request y darle una respuesta
