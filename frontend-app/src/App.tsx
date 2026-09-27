import { useEffect, useState } from "react";
import { createOrder } from "./api.js"; 
import "./App.css";
 

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import Chatbot from "./chatbot.js";

function Header({ cart }: { cart: number }) {
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
        <Typography variant="h6">متجر التقنية</Typography>
        <nav className="menu">
          <ul>
            <li><a href="#products">المنتجات</a></li>
            <li><a href="#compare">المقارنة</a></li>
            <li><a href="#order">اطلب الآن</a></li>
          </ul>
        </nav>
        <Typography>السلة: {cart} منتج</Typography>
      </Toolbar>
    </AppBar>
  );
}

function ProductCard({ name, price, available, onAdd }: { name: string; price: number; available: boolean; onAdd: () => void }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{name}</Typography>
        <Typography color="text.secondary">السعر: {price} دينار</Typography>
        <Typography sx={{ my: 1 }}>
          {available ? "متوفر" : "نفدت الكمية"}
        </Typography>
        <Button variant="contained" onClick={onAdd} disabled={!available}>
          {available ? "أضف للسلة" : "غير متوفر"}
        </Button>
      </CardContent>
    </Card>
  );
}

function Products({ products, onAdd }:{ products: { id: string; name: string; price: number; available: boolean }[]; onAdd: () => void }) {
  return (
    <section className="box" id="products">
      <Typography variant="h4" gutterBottom>منتجاتنا</Typography>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            available={product.available}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}

function Compare({ products }: { products: { id: string; name: string; price: number; available: boolean }[] }) {
  return (
    <section className="box" id="compare">
      <Typography variant="h4" gutterBottom>مقارنة سريعة</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>المنتج</TableCell>
            <TableCell>السعر</TableCell>
            <TableCell>التوفر</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price} دينار</TableCell>
              <TableCell>
                {product.available ? "متوفر" : "نفدت الكمية"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function OrderForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", product: "حاسوب محمول",
    quantity: 1, payment: "cash", terms: false, notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: name === "quantity" ? Number(value) : value,
    }));
    setSubmitted(false);
  };

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previousData) => ({
      ...previousData,
      terms: event.target.checked,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!formData.name.trim() || !formData.email.trim() ||
      formData.quantity < 1 || !formData.terms) {
    alert("يرجى تعبئة البيانات والموافقة على الشروط");
    return;
  }
  try {
    await createOrder({
      name: formData.name,
      email: formData.email,
      product: formData.product,
      quantity: formData.quantity,
    });
    setSubmitted(true);
  } catch (err) {
    if (err instanceof Error){
      alert(err.message);

    }else{
      alert("خطاء");
    }
  }
  };

  return (
    <section className="box" id="order">
      <Typography variant="h4" gutterBottom>نموذج الطلب</Typography>

      {submitted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          تم استلام طلبك بنجاح يا {formData.name}.
        </Alert>
      )}

      <form className="order-form" onSubmit={handleSubmit}>
        <TextField label="الاسم الكامل" name="name"
          value={formData.name} onChange={handleChange} fullWidth />

        <TextField label="البريد الإلكتروني" name="email" type="email"
          value={formData.email} onChange={handleChange} fullWidth />

        <TextField label="الكمية" name="quantity" type="number"
          slotProps={{ htmlInput: { min: 1 } }} value={formData.quantity}
          onChange={handleChange} fullWidth />

        <FormControl fullWidth>
          <InputLabel id="product-label">اختر المنتج</InputLabel>
          <Select labelId="product-label" name="product"
            value={formData.product} label="اختر المنتج"
            onChange={(e) => handleChange(e as unknown as React.ChangeEvent<HTMLSelectElement>)}>
            <MenuItem value="حاسوب محمول">حاسوب محمول</MenuItem>
            <MenuItem value="سماعات لاسلكية">سماعات لاسلكية</MenuItem>
            <MenuItem value="شاشة عرض">شاشة عرض</MenuItem>
          </Select>
        </FormControl>

        <FormLabel>طريقة الدفع</FormLabel>
        <RadioGroup row name="payment" value={formData.payment}
          onChange={handleChange}>
          <FormControlLabel value="cash" control={<Radio />} label="نقداً" />
          <FormControlLabel value="card" control={<Radio />} label="بطاقة" />
        </RadioGroup>

        <FormControlLabel
          control={
            <Checkbox checked={formData.terms} onChange={handleTermsChange} />
          }
          label="أوافق على الشروط والأحكام"
        />

        <TextField label="ملاحظات إضافية" name="notes" multiline rows={4}
          value={formData.notes} onChange={handleChange} fullWidth />

        <Button type="submit" variant="contained">إرسال الطلب</Button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bottom">
      <p>جميع الحقوق محفوظة - متجر التقنية 2026</p>
    </footer>
  );
}

function App() {
  const [cart, setCart] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!response.ok) {
          throw new Error("تعذر تحميل المنتجات");
        }
        const data = await response.json();
        
        setProducts(data);
      } catch (requestError) {
        if (requestError instanceof Error) {
          setError(requestError.message);
        } else {
          setError("حدث خطأ غير متوقع");
        }
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const addToCart = () => setCart((previousCart) => previousCart + 1);

  return (
    <div dir="rtl" className="store">
      <Header cart={cart} />
      <Container>
        {loading && (
          <div className="status">
            <CircularProgress />
            <p>...جاري تحميل المنتجات</p>
          </div>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <main>
            <Products products={products} onAdd={addToCart} />
            <Compare products={products} />
            <OrderForm />
            <Chatbot />
          </main>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default App;