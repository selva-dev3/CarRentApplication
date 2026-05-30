# Car Rental Application — Full Architecture Guide

**Stack:** Next.js 14 (App Router) · Python (FastAPI) · MongoDB (Mongoose via Motor)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Decision](#2-tech-stack-decision)
3. [Folder Structure](#3-folder-structure)
4. [MongoDB Schema Design](#4-mongodb-schema-design)
5. [Python FastAPI Backend](#5-python-fastapi-backend)
6. [Next.js Frontend](#6-nextjs-frontend)
7. [State Management Plan](#7-state-management-plan)
8. [API Routes Reference](#8-api-routes-reference)
9. [Authentication Flow](#9-authentication-flow)
10. [Booking State Machine](#10-booking-state-machine)
11. [Key Features Implementation](#11-key-features-implementation)
12. [Environment Setup](#12-environment-setup)

---

## 1. Project Overview

Car rental application with 3 user roles:

| Role | Responsibilities |
|------|-----------------|
| **Customer** | Search cars, book, pay, return, review |
| **Fleet Admin** | Add/manage cars, set availability, view earnings |
| **Super Admin** | Manage all users, resolve disputes, view analytics |

### Core Features

- Car search with filters (location, date, type, price, transmission)
- Multi-step booking flow with add-ons (insurance, GPS, child seat)
- Razorpay payment integration
- Real-time booking status tracking
- Review and rating system
- Admin dashboard with analytics
- Optimistic UI updates for instant feedback

---

## 2. Tech Stack Decision

```
Frontend    →  Next.js 14 (App Router)
Backend     →  Python FastAPI
Database    →  MongoDB Atlas
ODM         →  Motor (async MongoDB driver for Python)
Auth        →  JWT (access + refresh tokens)
Payments    →  Razorpay
State       →  Zustand + TanStack Query
File Upload →  Cloudinary (car images, license docs)
Deployment  →  Vercel (frontend) + Railway/Render (backend)
```

### Why This Stack?

**Next.js 14** — App Router gives server components, server actions, built-in image optimization, and easy deployment on Vercel.

**FastAPI** — Python's fastest async framework. Auto-generates OpenAPI docs. Pydantic models give strict validation. Easy to integrate with ML features later (e.g., dynamic pricing).

**MongoDB** — Car rental data is document-friendly. A booking document naturally embeds car snapshot, customer details, and payment info together. No complex JOINs needed.

---

## 3. Folder Structure

### Frontend (Next.js)

```
car-rental-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (customer)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    ← Home / search
│   │   ├── cars/
│   │   │   ├── page.tsx                ← Car listing
│   │   │   └── [carId]/
│   │   │       └── page.tsx            ← Car detail
│   │   ├── booking/
│   │   │   ├── page.tsx                ← Multi-step booking form
│   │   │   └── [bookingId]/
│   │   │       └── page.tsx            ← Booking detail / status
│   │   ├── my-bookings/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx                  ← Admin layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── cars/
│   │   │   ├── page.tsx                ← Car CRUD
│   │   │   └── [carId]/
│   │   │       └── page.tsx
│   │   ├── bookings/
│   │   │   └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── store/
│   │       └── authStore.ts
│   ├── cars/
│   │   ├── components/
│   │   │   ├── CarCard.tsx
│   │   │   ├── CarFilters.tsx
│   │   │   ├── CarGallery.tsx
│   │   │   └── CarAvailabilityCalendar.tsx
│   │   └── hooks/
│   │       ├── useCars.ts
│   │       ├── useCarDetail.ts
│   │       └── useCarSearch.ts
│   ├── booking/
│   │   ├── components/
│   │   │   ├── BookingForm/
│   │   │   │   ├── Step1_CarDates.tsx
│   │   │   │   ├── Step2_AddOns.tsx
│   │   │   │   ├── Step3_DriverDetails.tsx
│   │   │   │   ├── Step4_Payment.tsx
│   │   │   │   └── StepIndicator.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   └── BookingStatusBadge.tsx
│   │   ├── hooks/
│   │   │   ├── useCreateBooking.ts
│   │   │   ├── useCancelBooking.ts
│   │   │   └── useBookingPrice.ts
│   │   └── store/
│   │       └── bookingDraftStore.ts
│   └── admin/
│       ├── components/
│       │   ├── StatsCard.tsx
│       │   ├── BookingTable.tsx
│       │   └── EarningsChart.tsx
│       └── hooks/
│           └── useAdminStats.ts
│
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Spinner.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useGeoLocation.ts
│   └── lib/
│       ├── apiClient.ts
│       ├── dateUtils.ts
│       └── queryClient.ts
│
├── types/
│   ├── car.types.ts
│   ├── booking.types.ts
│   └── user.types.ts
│
└── middleware.ts                        ← Route protection
```

### Backend (FastAPI)

```
car-rental-backend/
├── app/
│   ├── main.py                          ← App entry point
│   ├── config.py                        ← Settings (pydantic-settings)
│   ├── database.py                      ← MongoDB Motor connection
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── router.py               ← Aggregate all routers
│   │   │   ├── auth.py
│   │   │   ├── cars.py
│   │   │   ├── bookings.py
│   │   │   ├── payments.py
│   │   │   ├── reviews.py
│   │   │   └── admin.py
│   │
│   ├── models/
│   │   ├── user.py                      ← Pydantic + MongoDB models
│   │   ├── car.py
│   │   ├── booking.py
│   │   └── review.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── car_service.py
│   │   ├── booking_service.py
│   │   └── payment_service.py
│   │
│   ├── middleware/
│   │   ├── auth_middleware.py           ← JWT verify
│   │   └── rate_limit.py
│   │
│   └── utils/
│       ├── jwt_utils.py
│       ├── password_utils.py
│       └── date_utils.py
│
├── tests/
├── requirements.txt
└── .env
```

---

## 4. MongoDB Schema Design

### User Collection

```python
# app/models/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId

class UserDocument(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    phone: str
    password_hash: str
    role: Literal["customer", "admin", "superadmin"] = "customer"
    is_verified: bool = False
    is_active: bool = True
    
    # Customer specific
    driving_license: Optional[str] = None       # Cloudinary URL
    license_number: Optional[str] = None
    license_expiry: Optional[datetime] = None
    
    # Profile
    avatar: Optional[str] = None
    address: Optional[dict] = None              # {street, city, state, pincode}
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
```

### Car Collection

```python
# app/models/car.py
class CarDocument(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    owner_id: str                               # Admin user _id
    
    # Basic info
    brand: str                                  # Toyota, Hyundai, etc.
    model: str                                  # Innova, Creta, etc.
    year: int
    registration_number: str
    color: str
    
    # Category
    car_type: Literal["sedan", "suv", "hatchback", "luxury", "van"]
    transmission: Literal["manual", "automatic"]
    fuel_type: Literal["petrol", "diesel", "electric", "hybrid"]
    seats: int
    
    # Pricing (per day in INR)
    price_per_day: float
    security_deposit: float
    
    # Location
    location: dict                              # {city, state, lat, lng}
    
    # Media
    images: list[str] = []                      # Cloudinary URLs
    
    # Status
    status: Literal["available", "booked", "maintenance", "inactive"] = "available"
    
    # Features
    features: list[str] = []                   # ["AC", "Bluetooth", "GPS", "Sunroof"]
    
    # Ratings (denormalized for fast listing)
    average_rating: float = 0.0
    total_reviews: int = 0
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Booking Collection

```python
# app/models/booking.py
class AddOn(BaseModel):
    name: Literal["insurance", "gps", "child_seat", "driver"]
    price_per_day: float

class BookingDocument(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    booking_number: str                         # AUTO: BK-2024-00001
    
    # References
    customer_id: str
    car_id: str
    
    # Snapshot at booking time (car data may change later)
    car_snapshot: dict                          # brand, model, image, price_per_day
    customer_snapshot: dict                     # name, phone, license_number
    
    # Dates
    pickup_date: datetime
    return_date: datetime
    actual_return_date: Optional[datetime] = None
    pickup_location: str
    
    # Add-ons selected
    add_ons: list[AddOn] = []
    
    # Pricing breakdown
    base_price: float                           # price_per_day × days
    add_ons_total: float
    discount: float = 0.0
    tax: float                                  # 18% GST
    total_amount: float
    security_deposit: float
    
    # Status
    status: Literal[
        "pending_payment",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "refund_initiated"
    ] = "pending_payment"
    
    # Payment
    payment_id: Optional[str] = None           # Razorpay payment ID
    payment_status: Literal["pending", "paid", "refunded"] = "pending"
    refund_amount: Optional[float] = None
    
    # Cancellation
    cancelled_by: Optional[str] = None         # "customer" | "admin"
    cancel_reason: Optional[str] = None
    cancelled_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Review Collection

```python
# app/models/review.py
class ReviewDocument(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    booking_id: str                             # One review per booking
    car_id: str
    customer_id: str
    
    rating: int                                 # 1–5
    comment: str
    images: list[str] = []                      # Optional photos
    
    is_approved: bool = True
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### MongoDB Indexes

```python
# database.py — create indexes on startup
async def create_indexes(db):
    # Users
    await db.users.create_index("email", unique=True)
    await db.users.create_index("phone", unique=True)
    
    # Cars
    await db.cars.create_index("status")
    await db.cars.create_index("location.city")
    await db.cars.create_index("car_type")
    await db.cars.create_index("price_per_day")
    await db.cars.create_index([("location.lat", 1), ("location.lng", 1)])  # Geo queries
    
    # Bookings
    await db.bookings.create_index("customer_id")
    await db.bookings.create_index("car_id")
    await db.bookings.create_index("status")
    await db.bookings.create_index("booking_number", unique=True)
    await db.bookings.create_index([("pickup_date", 1), ("return_date", 1)])
    
    # Reviews
    await db.reviews.create_index("car_id")
    await db.reviews.create_index("booking_id", unique=True)  # One review per booking
```

---

## 5. Python FastAPI Backend

### Entry Point

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_db, disconnect_db, create_indexes
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    await create_indexes()
    yield
    # Shutdown
    await disconnect_db()

app = FastAPI(
    title="Car Rental API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
```

### Database Connection

```python
# app/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client: AsyncIOMotorClient = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DB_NAME]
    print("✅ MongoDB connected")

async def disconnect_db():
    client.close()
    print("MongoDB disconnected")

def get_db():
    return db
```

### Config

```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str
    DB_NAME: str = "car_rental_db"
    
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Auth Routes

```python
# app/api/v1/auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserDocument
from app.services.auth_service import AuthService
from app.utils.jwt_utils import create_tokens, verify_token
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest):
    service = AuthService()
    user = await service.register(body)
    tokens = create_tokens(str(user["_id"]), user["role"])
    return {"user": user, **tokens}

@router.post("/login")
async def login(body: LoginRequest):
    service = AuthService()
    user = await service.login(body.email, body.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    tokens = create_tokens(str(user["_id"]), user["role"])
    return {"user": user, **tokens}

@router.post("/refresh")
async def refresh(refresh_token: str):
    payload = verify_token(refresh_token, token_type="refresh")
    tokens = create_tokens(payload["user_id"], payload["role"])
    return tokens

@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    return current_user
```

### Cars Routes

```python
# app/api/v1/cars.py
from fastapi import APIRouter, Depends, Query, UploadFile, File
from typing import Optional
from datetime import date

router = APIRouter(prefix="/cars", tags=["cars"])

@router.get("/")
async def list_cars(
    city: Optional[str] = None,
    car_type: Optional[str] = None,
    transmission: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    seats: Optional[int] = None,
    pickup_date: Optional[date] = None,
    return_date: Optional[date] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, le=50),
):
    """
    List available cars with filters.
    If pickup_date + return_date provided, excludes cars with conflicting bookings.
    """
    service = CarService()
    return await service.list_cars(
        filters={
            "city": city,
            "car_type": car_type,
            "transmission": transmission,
            "min_price": min_price,
            "max_price": max_price,
            "seats": seats,
        },
        dates=(pickup_date, return_date),
        page=page,
        limit=limit
    )

@router.get("/{car_id}")
async def get_car(car_id: str):
    service = CarService()
    car = await service.get_car_by_id(car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@router.get("/{car_id}/availability")
async def get_availability(car_id: str, month: int, year: int):
    """Returns list of booked date ranges for the calendar."""
    service = CarService()
    return await service.get_booked_dates(car_id, month, year)

@router.post("/", dependencies=[Depends(require_admin)])
async def create_car(car_data: CarCreateRequest, images: list[UploadFile] = File(...)):
    service = CarService()
    return await service.create_car(car_data, images)

@router.put("/{car_id}", dependencies=[Depends(require_admin)])
async def update_car(car_id: str, car_data: CarUpdateRequest):
    service = CarService()
    return await service.update_car(car_id, car_data)

@router.delete("/{car_id}", dependencies=[Depends(require_admin)])
async def delete_car(car_id: str):
    service = CarService()
    await service.soft_delete_car(car_id)
    return {"message": "Car deleted"}
```

### Bookings Routes

```python
# app/api/v1/bookings.py
router = APIRouter(prefix="/bookings", tags=["bookings"])

class CreateBookingRequest(BaseModel):
    car_id: str
    pickup_date: datetime
    return_date: datetime
    pickup_location: str
    add_ons: list[str] = []    # ["insurance", "gps"]
    promo_code: Optional[str] = None

@router.post("/")
async def create_booking(
    body: CreateBookingRequest,
    current_user = Depends(get_current_user)
):
    """
    Creates booking in 'pending_payment' status.
    Also creates Razorpay order for payment.
    """
    service = BookingService()
    booking, razorpay_order = await service.create_booking(
        customer_id=str(current_user["_id"]),
        data=body
    )
    return {
        "booking": booking,
        "razorpay_order": razorpay_order  # Pass to frontend for payment
    }

@router.get("/my")
async def my_bookings(
    status: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    service = BookingService()
    return await service.get_customer_bookings(
        customer_id=str(current_user["_id"]),
        status=status
    )

@router.get("/{booking_id}")
async def get_booking(booking_id: str, current_user = Depends(get_current_user)):
    service = BookingService()
    booking = await service.get_booking(booking_id)
    # Customer can only see their own bookings
    if current_user["role"] == "customer":
        if booking["customer_id"] != str(current_user["_id"]):
            raise HTTPException(status_code=403, detail="Forbidden")
    return booking

@router.patch("/{booking_id}/cancel")
async def cancel_booking(
    booking_id: str,
    reason: str,
    current_user = Depends(get_current_user)
):
    service = BookingService()
    return await service.cancel_booking(
        booking_id=booking_id,
        cancelled_by=current_user["role"],
        reason=reason
    )

@router.patch("/{booking_id}/status", dependencies=[Depends(require_admin)])
async def update_booking_status(
    booking_id: str,
    new_status: str
):
    """Admin only — confirm, activate, complete bookings."""
    service = BookingService()
    return await service.transition_status(booking_id, new_status)
```

### Payment Routes

```python
# app/api/v1/payments.py
import razorpay
from app.config import settings

router = APIRouter(prefix="/payments", tags=["payments"])
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

@router.post("/verify")
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    booking_id: str,
    current_user = Depends(get_current_user)
):
    """
    Verify Razorpay signature.
    On success → update booking to 'confirmed', car status to 'booked'.
    """
    # Verify signature
    params = {
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": razorpay_payment_id,
        "razorpay_signature": razorpay_signature,
    }
    try:
        razorpay_client.utility.verify_payment_signature(params)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    service = BookingService()
    booking = await service.confirm_payment(booking_id, razorpay_payment_id)
    return {"message": "Payment successful", "booking": booking}

@router.post("/refund/{booking_id}", dependencies=[Depends(require_admin)])
async def process_refund(booking_id: str):
    service = BookingService()
    return await service.process_refund(booking_id)
```

### Booking Service (Business Logic)

```python
# app/services/booking_service.py
from app.database import get_db
from app.utils.date_utils import calculate_days
from bson import ObjectId
from datetime import datetime

# State machine — allowed transitions
ALLOWED_TRANSITIONS = {
    "pending_payment": ["confirmed", "cancelled"],
    "confirmed":       ["active", "cancelled"],
    "active":          ["completed"],
    "completed":       [],
    "cancelled":       ["refund_initiated"],
    "refund_initiated": [],
}

class BookingService:
    def __init__(self):
        self.db = get_db()

    async def create_booking(self, customer_id: str, data):
        db = self.db
        
        # 1. Check car availability for requested dates
        conflict = await db.bookings.find_one({
            "car_id": data.car_id,
            "status": {"$in": ["confirmed", "active"]},
            "$or": [
                {"pickup_date": {"$lte": data.return_date}, "return_date": {"$gte": data.pickup_date}}
            ]
        })
        if conflict:
            raise HTTPException(status_code=409, detail="Car not available for selected dates")
        
        # 2. Get car details
        car = await db.cars.find_one({"_id": ObjectId(data.car_id)})
        
        # 3. Calculate price
        days = calculate_days(data.pickup_date, data.return_date)
        base_price = car["price_per_day"] * days
        add_ons_data = self._get_addons_price(data.add_ons)
        add_ons_total = sum(a["price_per_day"] for a in add_ons_data) * days
        tax = (base_price + add_ons_total) * 0.18  # 18% GST
        total = base_price + add_ons_total + tax
        
        # 4. Create Razorpay order
        razorpay_order = razorpay_client.order.create({
            "amount": int(total * 100),  # paise
            "currency": "INR",
            "receipt": f"rcpt_{ObjectId()}",
        })
        
        # 5. Create booking document
        booking_doc = {
            "booking_number": await self._generate_booking_number(),
            "customer_id": customer_id,
            "car_id": data.car_id,
            "car_snapshot": {
                "brand": car["brand"], "model": car["model"],
                "image": car["images"][0] if car["images"] else None,
                "price_per_day": car["price_per_day"],
            },
            "pickup_date": data.pickup_date,
            "return_date": data.return_date,
            "pickup_location": data.pickup_location,
            "add_ons": add_ons_data,
            "base_price": base_price,
            "add_ons_total": add_ons_total,
            "tax": round(tax, 2),
            "total_amount": round(total, 2),
            "security_deposit": car["security_deposit"],
            "status": "pending_payment",
            "razorpay_order_id": razorpay_order["id"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        result = await db.bookings.insert_one(booking_doc)
        booking_doc["_id"] = str(result.inserted_id)
        
        return booking_doc, razorpay_order

    async def transition_status(self, booking_id: str, new_status: str):
        db = self.db
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
        
        if new_status not in ALLOWED_TRANSITIONS.get(booking["status"], []):
            raise HTTPException(
                status_code=400,
                detail=f"Cannot transition from {booking['status']} to {new_status}"
            )
        
        update = {"status": new_status, "updated_at": datetime.utcnow()}
        
        # Side effects per transition
        if new_status == "active":
            # Car status → active_rental
            await db.cars.update_one(
                {"_id": ObjectId(booking["car_id"])},
                {"$set": {"status": "booked"}}
            )
        elif new_status == "completed":
            update["actual_return_date"] = datetime.utcnow()
            # Car status → available
            await db.cars.update_one(
                {"_id": ObjectId(booking["car_id"])},
                {"$set": {"status": "available"}}
            )
        
        await db.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": update}
        )
        return await db.bookings.find_one({"_id": ObjectId(booking_id)})
```

---

## 6. Next.js Frontend

### API Client

```typescript
// shared/lib/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh on 401
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const { access_token } = await axios.post('/auth/refresh', { refreshToken });
        localStorage.setItem('access_token', access_token);
        return apiClient(error.config); // Retry original request
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Zustand Stores

```typescript
// features/auth/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'superadmin';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      login: (user, accessToken) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null }),
      updateProfile: (data) => set((s) => ({
        user: s.user ? { ...s.user, ...data } : null
      })),
    }),
    { name: 'auth-storage' }
  )
);
```

```typescript
// features/cars/store/searchStore.ts
import { create } from 'zustand';

interface SearchFilters {
  carType?: string;
  transmission?: string;
  maxPrice: number;
  seats?: number;
}

interface SearchState {
  location: string;
  pickupDate: Date | null;
  returnDate: Date | null;
  filters: SearchFilters;
  setLocation: (loc: string) => void;
  setDates: (pickup: Date, ret: Date) => void;
  setFilter: (key: keyof SearchFilters, val: any) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: SearchFilters = { maxPrice: 10000 };

export const useSearchStore = create<SearchState>((set) => ({
  location: '',
  pickupDate: null,
  returnDate: null,
  filters: DEFAULT_FILTERS,
  setLocation: (location) => set({ location }),
  setDates: (pickupDate, returnDate) => set({ pickupDate, returnDate }),
  setFilter: (key, val) => set((s) => ({
    filters: { ...s.filters, [key]: val }
  })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
```

```typescript
// features/booking/store/bookingDraftStore.ts
import { create } from 'zustand';

interface AddOn {
  name: string;
  price: number;
}

interface BookingDraftState {
  selectedCar: any | null;
  addOns: AddOn[];
  step: number;
  selectCar: (car: any) => void;
  toggleAddOn: (addon: AddOn) => void;
  nextStep: () => void;
  prevStep: () => void;
  clearDraft: () => void;
}

export const useBookingDraftStore = create<BookingDraftState>((set) => ({
  selectedCar: null,
  addOns: [],
  step: 1,
  selectCar: (car) => set({ selectedCar: car }),
  toggleAddOn: (addon) => set((s) => ({
    addOns: s.addOns.some(a => a.name === addon.name)
      ? s.addOns.filter(a => a.name !== addon.name)
      : [...s.addOns, addon]
  })),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  clearDraft: () => set({ selectedCar: null, addOns: [], step: 1 }),
}));
```

### TanStack Query Hooks

```typescript
// features/cars/hooks/useCars.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import { useSearchStore } from '@/features/cars/store/searchStore';
import { useDebounce } from '@/shared/hooks/useDebounce';

export function useCars() {
  const { location, pickupDate, returnDate, filters } = useSearchStore();
  const debouncedFilters = useDebounce(filters, 400);

  return useQuery({
    queryKey: ['cars', location, pickupDate, returnDate, debouncedFilters],
    queryFn: () => apiClient.get('/cars', {
      params: {
        city: location,
        pickup_date: pickupDate?.toISOString(),
        return_date: returnDate?.toISOString(),
        ...debouncedFilters,
      }
    }),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useCarDetail(carId: string) {
  return useQuery({
    queryKey: ['car', carId],
    queryFn: () => apiClient.get(`/cars/${carId}`),
    enabled: !!carId,
  });
}
```

```typescript
// features/booking/hooks/useCreateBooking.ts
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { clearDraft } = useBookingDraftStore();

  return useMutation({
    mutationFn: (data: CreateBookingPayload) =>
      apiClient.post('/bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      clearDraft();
    },
  });
}

// features/booking/hooks/useCancelBooking.ts — Optimistic update
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
      apiClient.patch(`/bookings/${bookingId}/cancel`, { reason }),

    onMutate: async ({ bookingId }) => {
      await queryClient.cancelQueries({ queryKey: ['my-bookings'] });
      const prev = queryClient.getQueryData(['my-bookings']);
      queryClient.setQueryData(['my-bookings'], (old: any[]) =>
        old?.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['my-bookings'], ctx?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
}
```

### Custom Hooks

```typescript
// features/booking/hooks/useBookingPrice.ts
import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';

const ADD_ON_PRICES: Record<string, number> = {
  insurance: 300,
  gps: 150,
  child_seat: 200,
  driver: 800,
};

export function useBookingPrice() {
  const { selectedCar, addOns } = useBookingDraftStore();
  const { pickupDate, returnDate } = useSearchStore();

  return useMemo(() => {
    if (!selectedCar || !pickupDate || !returnDate) return null;

    const days = differenceInDays(returnDate, pickupDate);
    if (days <= 0) return null;

    const base = selectedCar.price_per_day * days;
    const addOnsTotal = addOns.reduce((sum, a) => sum + (ADD_ON_PRICES[a.name] ?? 0), 0) * days;
    const tax = (base + addOnsTotal) * 0.18;
    const total = base + addOnsTotal + tax;

    return {
      days,
      base: Math.round(base),
      addOnsTotal: Math.round(addOnsTotal),
      tax: Math.round(tax),
      total: Math.round(total),
      deposit: selectedCar.security_deposit,
    };
  }, [selectedCar, addOns, pickupDate, returnDate]);
}
```

```typescript
// shared/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### Route Protection (Middleware)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/cars'];
const ADMIN_ROUTES = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Public routes — allow all
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // No token — redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // Admin routes — check role
    if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
      if (!['admin', 'superadmin'].includes(payload.role as string)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Booking Page (Multi-step form)

```tsx
// app/(customer)/booking/page.tsx
'use client';
import { useBookingDraftStore } from '@/features/booking/store/bookingDraftStore';
import { useCreateBooking } from '@/features/booking/hooks/useCreateBooking';
import { useBookingPrice } from '@/features/booking/hooks/useBookingPrice';
import Step1CarDates from '@/features/booking/components/BookingForm/Step1_CarDates';
import Step2AddOns from '@/features/booking/components/BookingForm/Step2_AddOns';
import Step3DriverDetails from '@/features/booking/components/BookingForm/Step3_DriverDetails';
import Step4Payment from '@/features/booking/components/BookingForm/Step4_Payment';
import StepIndicator from '@/features/booking/components/BookingForm/StepIndicator';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const { step } = useBookingDraftStore();
  const createBooking = useCreateBooking();
  const price = useBookingPrice();
  const router = useRouter();

  const handlePaymentSuccess = async (razorpayData: any) => {
    await createBooking.mutateAsync(razorpayData);
    router.push('/my-bookings');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <StepIndicator currentStep={step} totalSteps={4} />
      <div className="mt-8">
        {step === 1 && <Step1CarDates />}
        {step === 2 && <Step2AddOns />}
        {step === 3 && <Step3DriverDetails />}
        {step === 4 && <Step4Payment priceBreakdown={price} onSuccess={handlePaymentSuccess} />}
      </div>
    </div>
  );
}
```

---

## 7. State Management Plan

| Data | Tool | Why |
|------|------|-----|
| User auth, role | Zustand (persisted) | Needed across all pages and on refresh |
| Search location, dates, filters | Zustand | Shared between search bar and listing page |
| Booking form progress (multi-step) | Zustand | User navigates back — data must persist |
| Cars list, car detail | TanStack Query | Server data, needs caching and refetch |
| My bookings list | TanStack Query | Server data, invalidated after mutations |
| Booking price calculation | useMemo | Derived from Zustand — fast, no API needed |
| Modal open/close, form inputs | useState | Local UI state, no sharing needed |
| Theme (light/dark) | useContext | App-wide, slow changing |

---

## 8. API Routes Reference

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | — | Register new user |
| POST | `/auth/login` | — | Login, returns JWT |
| POST | `/auth/refresh` | — | Refresh access token |
| GET | `/auth/me` | Customer | Get current user |
| PATCH | `/auth/me` | Customer | Update profile |

### Cars

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/cars` | — | List cars with filters |
| GET | `/cars/{id}` | — | Car detail |
| GET | `/cars/{id}/availability` | — | Booked dates for calendar |
| GET | `/cars/{id}/reviews` | — | Car reviews |
| POST | `/cars` | Admin | Add new car |
| PUT | `/cars/{id}` | Admin | Update car |
| DELETE | `/cars/{id}` | Admin | Soft delete car |

### Bookings

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/bookings` | Customer | Create booking + Razorpay order |
| GET | `/bookings/my` | Customer | My bookings list |
| GET | `/bookings/{id}` | Customer/Admin | Booking detail |
| PATCH | `/bookings/{id}/cancel` | Customer/Admin | Cancel booking |
| PATCH | `/bookings/{id}/status` | Admin | Status transition |
| GET | `/bookings` | Admin | All bookings |

### Payments

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/payments/verify` | Customer | Verify Razorpay payment |
| POST | `/payments/refund/{id}` | Admin | Process refund |

### Reviews

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/reviews` | Customer | Submit review (after completion) |
| GET | `/reviews/car/{id}` | — | Car's reviews |
| DELETE | `/reviews/{id}` | Admin | Remove review |

### Admin

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/admin/stats` | Admin | Dashboard stats |
| GET | `/admin/users` | Superadmin | All users |
| GET | `/admin/analytics` | Admin | Revenue, booking charts |

---

## 9. Authentication Flow

```
Customer:
  1. POST /auth/register → gets {access_token, refresh_token}
  2. Tokens stored in cookies (httpOnly) + Zustand
  3. Every API request → access_token in Authorization header
  4. Access token expires (30 min) → interceptor auto-calls /auth/refresh
  5. Refresh token expires (7 days) → redirect to /login

JWT Payload:
  {
    "user_id": "...",
    "role": "customer",
    "exp": 1234567890
  }

Next.js Middleware:
  - Reads access_token from cookie
  - Verifies with jose (edge runtime compatible)
  - /admin/* routes → check role is admin/superadmin
  - Protected routes → redirect to /login if no valid token
```

---

## 10. Booking State Machine

```
                    ┌──────────────────┐
                    │  pending_payment │
                    └────────┬─────────┘
              payment ok     │      payment failed / timeout
                ┌────────────┘           │
                ▼                        ▼
          ┌──────────┐             ┌───────────┐
          │confirmed │             │ cancelled │
          └────┬─────┘             └─────┬─────┘
    key hand   │   before pickup         │
    over       │   admin cancels         │ refund eligible
               ▼                         ▼
          ┌─────────┐             ┌──────────────────┐
          │  active │             │ refund_initiated  │
          └────┬────┘             └──────────────────┘
      car      │
    returned   │
               ▼
          ┌───────────┐
          │ completed │  ← customer can submit review now
          └───────────┘
```

### Cancellation Refund Policy

| When Cancelled | Refund % |
|---------------|---------|
| 7+ days before pickup | 100% |
| 3–6 days before pickup | 75% |
| 1–2 days before pickup | 50% |
| Less than 24 hours | 0% |

---

## 11. Key Features Implementation

### Car Availability Check (Conflict Query)

```python
# Check if car is free for requested date range
pipeline = [
    {
        "$match": {
            "car_id": car_id,
            "status": {"$in": ["confirmed", "active"]},
            "$or": [
                {
                    "pickup_date": {"$lte": return_date},
                    "return_date": {"$gte": pickup_date}
                }
            ]
        }
    }
]
conflict = await db.bookings.find_one(pipeline[0]["$match"])
```

### Car Listing with Availability Filter

```python
async def list_available_cars(filters, pickup_date, return_date):
    # Step 1: Find all booked car_ids for the date range
    booked_car_ids = await db.bookings.distinct(
        "car_id",
        {
            "status": {"$in": ["confirmed", "active"]},
            "pickup_date": {"$lte": return_date},
            "return_date": {"$gte": pickup_date},
        }
    )
    
    # Step 2: Query cars excluding booked ones
    query = {
        "status": "available",
        "_id": {"$nin": [ObjectId(id) for id in booked_car_ids]},
        **build_filter_query(filters)
    }
    
    cursor = db.cars.find(query).skip((page-1)*limit).limit(limit)
    return await cursor.to_list(length=limit)
```

### Booking Number Generation

```python
async def _generate_booking_number(self) -> str:
    year = datetime.utcnow().year
    prefix = f"BK-{year}-"
    
    last = await self.db.bookings.find_one(
        {"booking_number": {"$regex": f"^{prefix}"}},
        sort=[("booking_number", -1)]
    )
    
    if last:
        last_num = int(last["booking_number"].split("-")[-1])
        return f"{prefix}{str(last_num + 1).zfill(5)}"
    return f"{prefix}00001"
```

### Razorpay Integration (Frontend)

```typescript
// features/booking/components/BookingForm/Step4_Payment.tsx
declare global {
  interface Window { Razorpay: any; }
}

async function initiatePayment(booking: any, order: any) {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'Car Rental',
      description: `Booking ${booking.booking_number}`,
      order_id: order.id,
      handler: async (response: any) => {
        // Verify on backend
        await apiClient.post('/payments/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          booking_id: booking._id,
        });
        resolve(response);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: { color: '#0070f3' },
    });
    rzp.on('payment.failed', reject);
    rzp.open();
  });
}
```

---

## 12. Environment Setup

### Backend `.env`

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=car_rental_db

JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

### Backend Setup Commands

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install fastapi uvicorn motor pydantic pydantic-settings \
            python-jose passlib razorpay cloudinary python-multipart

# Run dev server
uvicorn app.main:app --reload --port 8000

# API docs auto-available at:
# http://localhost:8000/docs      (Swagger UI)
# http://localhost:8000/redoc     (ReDoc)
```

### Frontend Setup Commands

```bash
# Create Next.js project
npx create-next-app@latest car-rental-frontend --typescript --tailwind --app

# Install dependencies
npm install @tanstack/react-query zustand axios date-fns
npm install zustand @tanstack/react-query-devtools
npm install jose                                # JWT verify in middleware

# Run dev server
npm run dev
# http://localhost:3000
```

### `requirements.txt`

```
fastapi==0.111.0
uvicorn[standard]==0.30.0
motor==3.4.0
pydantic==2.7.0
pydantic-settings==2.3.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
razorpay==1.4.1
cloudinary==1.40.0
python-multipart==0.0.9
```

---

## Quick Start Summary

```
1. Clone repo, setup .env files
2. Start MongoDB Atlas cluster (free tier ok for dev)
3. cd backend → uvicorn app.main:app --reload
4. cd frontend → npm run dev
5. Visit http://localhost:3000
6. API docs → http://localhost:8000/docs
```

---

*Document version 1.0 — Next.js 14 · FastAPI · MongoDB*
