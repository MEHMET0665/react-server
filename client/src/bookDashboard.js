import React,{useEffect,useState} from 'react'
//               ***INSTRUCTIONS***
//  Use this info provided here to create Dashboard
// 1. Use this api to get images of books https://openlibrary.org/subjects/science_fiction.json?limit=12

//const books = Array.isArray(data?.works) ? data.works : [];
// 2. Add the below as src and alt when rendering each image
// src={`https://covers.openlibrary.org/b/id/${photo.cover_id}-M.jpg`} 
// alt={photo.title} 

// 3. Add a text which says 'loading' when api is loading
// 4. Store the book results as data.works. Render the books images in the dahboard as 4x3 and title below that (4 rows 3 columns)

// 5. Add Text box to filter on book title
// 6. Change the api limit to fetch 100 images and show pagination with each page having 10 images of Book.

// src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}


const image_api_url = "https://openlibrary.org/subjects/science_fiction.json?limit=120"
export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ error, setError] = useState("");
  const [filterText, setFilterText] = useState("");
  const fecthData=async ()=>{
    setLoading(true)
    const resp=await fetch(image_api_url)
    try{
      if(!resp.ok){
        setError(`failed fetch data with status ${resp.status}`)
      }
      const dataFormat= await resp.json()
      setBooks(dataFormat.works)
       setAllBooks(dataFormat.works);
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    fecthData()
  },[])
  useEffect(() => {
    const filterData = allBooks.filter((book) =>
      book.title?.toLowerCase().includes(filterText.toLowerCase())
    );

    setBooks(filterData);
  }, [filterText, allBooks]);
  if (loading){
    return (
      <div>loading</div>
    )
  }
    if (error){
    return (
      <div>{error}</div>
    )
  }

  return (
    <div style={{ display: "flex",flexDirection:"column", gap:'20px'}}>
      <h1>list of book</h1>
      <input 
      type="text" 
      value={filterText} 
      onChange={(e)=>setFilterText(e.target.value)}
      placeholder="Search book..."
      />
       <div style={{display:'grid', gridTemplateColumns: `repeat(3,1fr)`, gap:'15px'}}>
      {books?.map((book,key)=>(
        <div>
          <img  src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`} alt="" />
          <p>{book.title}</p>
        </div>        
      ))}
      </div>
      
    </div>
  )
}
