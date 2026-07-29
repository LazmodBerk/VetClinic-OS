from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.billing import Invoice, InvoiceItem, Payment
from app.models.user import User
from app.schemas.billing import Invoice as InvoiceSchema, InvoiceCreate, Payment as PaymentSchema, PaymentCreate

router = APIRouter()

# --- INVOICES ---

@router.get("/invoices", response_model=List[InvoiceSchema])
def read_invoices(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve invoices.
    """
    invoices = db.query(Invoice).filter(Invoice.clinic_id == current_user.clinic_id).order_by(Invoice.issue_date.desc()).offset(skip).limit(limit).all()
    # Need to load items manually or ensure they are lazy loaded correctly by ORM
    for inv in invoices:
        inv.items = db.query(InvoiceItem).filter(InvoiceItem.invoice_id == inv.id).all()
    return invoices

@router.post("/invoices", response_model=InvoiceSchema)
def create_invoice(
    *,
    db: Session = Depends(deps.get_db),
    invoice_in: InvoiceCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new invoice with its items.
    """
    invoice_data = invoice_in.model_dump(exclude={"items"})
    invoice = Invoice(
        **invoice_data,
        clinic_id=current_user.clinic_id
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    # Create items
    items_created = []
    for item_in in invoice_in.items:
        item = InvoiceItem(
            **item_in.model_dump(),
            invoice_id=invoice.id
        )
        db.add(item)
        items_created.append(item)
        
    db.commit()
    invoice.items = items_created
    return invoice

@router.put("/invoices/{id}/pay", response_model=InvoiceSchema)
def pay_invoice(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Mark an invoice as paid.
    """
    invoice = db.query(Invoice).filter(Invoice.id == id, Invoice.clinic_id == current_user.clinic_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice.status = "PAID"
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    invoice.items = db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice.id).all()
    return invoice

# --- PAYMENTS ---

@router.get("/payments", response_model=List[PaymentSchema])
def read_payments(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve payments.
    """
    payments = db.query(Payment).filter(Payment.clinic_id == current_user.clinic_id).order_by(Payment.payment_date.desc()).offset(skip).limit(limit).all()
    return payments

@router.post("/payments", response_model=PaymentSchema)
def create_payment(
    *,
    db: Session = Depends(deps.get_db),
    payment_in: PaymentCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new payment.
    """
    payment = Payment(
        **payment_in.model_dump(),
        clinic_id=current_user.clinic_id
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment
