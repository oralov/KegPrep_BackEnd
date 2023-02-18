const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { MongoClient} = require('mongodb');
const uri = "mongodb+srv://Admin:27071995aA@cluster0.tdenifs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());

app.get("/", (req, res) =>{
  res.sendFile('public/search.html', {root: __dirname });
})


app.post('/recipes', (req, res) => {
    let arr = [];
   for(let i = 0; i < req.body.ing.length; i++){
     arr.push({Name: req.body.ing[i], Amount: req.body.amount[i], Measure: req.body.measure[i]});
   }
   let recipe = { Name: req.body.name,
                  Ingredients: arr,
                  Steps: req.body.step,
                  Note: req.body.note,
                  ShelfLife: req.body.shelfLife,
                  Yield: req.body.yield,
                  Storage: req.body.storage
                  }
  
client.connect(err => {
            const collection = client.db("KegPrep").collection("recipes");
            // perform actions on the collection object
            //findByName("baked garlic shrimp", collection);
          //insert(collection);
          //onSubmit(); 
         insert(collection, recipe);
          });
})

app.get("/recipes", (req, res) => {
  client.connect(err => {
    const collection = client.db("KegPrep").collection("recipes");
    collection.find({}).toArray(function(err, result) {
      if(err) throw err;
      res.send(result);
    })
  })
})

app.get("/recipes/:recipeName", (req,res) =>{
  client.connect(err => {
    const collection = client.db("KegPrep").collection("recipes");
    collection.findOne({Name: {$regex: req.params.recipeName.toLowerCase()}}, function(err, result) {
      
     if (err) throw err;
     /*res.send(
      `<p>${result.Name}</p>
      <div>
       ${
       result.Ingredients.map(element => "<p>" + element.Name + " - " + element.Amount + element.Measure +  "</p>").join('')
       }
      </div>
      <p></p>
      <div>
      ${
        result.Steps.map(element => "<p>" + element + "</p>").join('')
        }
      </div>
      <p>${result.ShelfLife}</p>
      <p>${result.Yield}</p>
      <p>${result.Storage}</p>
      <p>${result.Note}</p>

      `
     )
      */
      res.send(result);
     
      
      client.close();
    });
  });
});

app.listen(8080);


function insert(collection, recipe){
    collection.insertOne(recipe, function(err, res){
        if(err) throw err
        console.log("1 document inserted");
        client.close();
    });    
}



function addIngredient(addTo){
  let div = document.createElement("div");
  
  let element = document.createElement("input");
  let amount = document.createElement("input");
  let measure = document.createElement("input");
  
  let elementLabel = document.createElement("label");
  let amountLabel = document.createElement("label");
  let measureLabel = document.createElement("label");
  let p = document.createElement("p");
  
  elementLabel.textContent = "Ingredient: ";
  elementLabel.setAttribute("class", "inputs");
  amountLabel.textContent = "Amount: ";
  amountLabel.setAttribute("class", "inputs");
  measureLabel.textContent = "Measure: ";
  measureLabel.setAttribute("class", "inputs");
  
  element.setAttribute("type", "text");
  element.setAttribute("class", "inputs");
  element.setAttribute("name", "ing")
  amount.setAttribute("type", "text");
  amount.setAttribute("name", "amount" );
  amount.setAttribute("class", "inputs");
  measure.setAttribute("type", "text");
  measure.setAttribute("name", "measure" );
  measure.setAttribute("class", "inputs");
  
  let ings = document.getElementById(`${addTo}`);
  div.setAttribute("class", "lines")
  div.appendChild(elementLabel);
  div.appendChild(element);
  div.appendChild(amountLabel);
  div.appendChild(amount);
  div.appendChild(measureLabel);
  div.appendChild(measure);
  ings.appendChild(div);
  ings.appendChild(p);
  ings.appendChild(p);
  }

  function addStep(addTo){
    let steps = document.getElementById(`${addTo}`);
    let step = document.createElement("input");
    step.setAttribute("type", "text");
    step.setAttribute("name", "step");
    step.setAttribute("class", "steps" );
    let p = document.createElement("p");
    steps.appendChild(step);
    steps.appendChild(p);
  }


  








