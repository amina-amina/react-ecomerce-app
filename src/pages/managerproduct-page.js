import React, { Component } from 'react'
import Globaldesign from '../components/globaldesign'
import Product from '../components/product'
import ProductModel from '../models/product-model'
import axios from '../utils/axios'
import CategorieModel from '../models/categorie-model'

export default class ManagerProductPage extends Component {
    constructor(){
        super()
        this.state={
            avatar:"",
            title:"",
            quantity:"",
            price:"",
            categorie:"",
            description:"",
            list_product:[],
            list_categorie:[]
        }
    }
    
    componentDidMount() {
        axios.get("categories.json").then((response) => {
          if (response.data != null) {
            //extraire toutes les clé de l'objet data
            let keys = Object.keys(response.data);
    
            //parcourir les keys
            let listcategorienew = keys.map((k) => {
              let ns = new CategorieModel(
                k,
                response.data[k].nom,
                response.data[k].description,
               
              );
    
              return ns;
            });
    
            //ajouter la liste
            this.setState({ list_categorie: listcategorienew });
            this.setState({ backup: listcategorienew });
    
            //ajouter un backup
           
          }
        });

        axios.get("products.json").then((response) => {
            if (response.data != null) {
              //extraire toutes les clé de l'objet data
              let keys = Object.keys(response.data);
      
              //parcourir les keys
              let listproductnew = keys.map((k) => {
                let ns = new ProductModel(
                  k,
                  response.data[k].avatar,
                  response.data[k].title,
                  response.data[k].quantity,
                  response.data[k].price,
                  response.data[k].categorie,
                  response.data[k].description,
                 
                );
      
                return ns;
              });
      
              //ajouter la liste
              this.setState({ list_product: listproductnew });
              this.setState({ backup: listproductnew  });
      
              //ajouter un backup
             
            }
          });
      }
    render() {
        return (
            <div>
                <Globaldesign>
                    <Product
                    change={this.change}
                    submitAdd={this.submitADD}
                    data={this.state.list_product}
                    dataSelect={this.state.list_categorie}
                    >
                        
                    </Product>
                </Globaldesign>
            </div>
        )
    }
    change=(event)=>{
        let name=event.target.name;
        let value=event.target.value;
console.log(name,value)
        this.setState({ [name]: value })

    }
    submitADD=(event)=>{
        event.preventDefault();
        //vider les inputs de formulaire
        event.target.reset();

        //validation de formulaire
        if (
            this.state.title == ""||
            this.state.quantity==""||
            this.state.price==""||
            this.state.categorie==""
        ) {
            alert("veuillez remplir toutes les champs de produits")
        } else {
            let nvProduct = new ProductModel(
                0,
                this.state.avatar,
                this.state.title,
                this.state.quantity,
                this.state.price,
                this.state.categorie,
                this.state.description

            )
            //vider states
            this.setState({
                avatar: "",
                title: "",
                quantity:"",
                price:"",
                categorie:"",
                description:""



            })
            //ajouter student a la liste
            let newproductList = this.state.list_product
            newproductList.push(nvProduct)
            console.log(newproductList)
            this.setState({ list_product: newproductList  })


            const data_product = {
            
                avatar: nvProduct.avatar,
                title: nvProduct.title,
                quantity: nvProduct.quantity,
                price: nvProduct.price,
                categorie: nvProduct.categorie,
                description: nvProduct.description
               
              };
        
              axios.post("products.json", data_product).then((response) => {
                //console.log(response)
                let id_new_product = response.data.name;
               
        
                //chercher l'etudiant qui a l'Id==0 sur la liste
                let newListproduct= this.state.list_product;
                newListproduct.forEach((s) => {
                  if (s.id == 0) {
                    s.id = id_new_product;
                  }
                  //modifier la liste sur le state
        
                });
                this.setState({ list_product: newListproduct })
               
              });
        

        }
    }
}


