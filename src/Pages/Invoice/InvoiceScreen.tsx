import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Button } from '@mui/material';
import MinimalAppBar from '../../Component/MinimalAppBar';
import callApi from '../../Services/callApi';
import './InvoiceScreen.css';
import InvoiceUploadModal from './InvoiceUploadModal';
import SlipPreviewModal from './SlipPreviewModal';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Define the Invoice interface based on assumptions, will adjust if API differs
export interface Invoice {
    id: number;
    date: string;
    amount: number;
    paymentMethod: string;
    description: string;
    isPaid: boolean;
    fullname: string;
    slipUrl?: string | null;
}

const InvoiceScreen: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await callApi.get('mobile/myinvoice');
            // Assuming response.data is the list or response.data.data
            // Safety check for array
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setInvoices(data);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleOpenUpload = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setUploadModalOpen(true);
    };

    const handleOpenPreview = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setPreviewModalOpen(true);
    };

    const handleUploadSuccess = () => {

        fetchInvoices(); // Refresh list after upload
        setUploadModalOpen(false);
    };

    return (
        <div className="invoice-container">
            <MinimalAppBar onBack={() => window.history.back()} title="รายการใบแจ้งหนี้" />
            <Container maxWidth="sm" sx={{ padding: 2, pt: 8 }}>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress sx={{ color: '#FF9A9E' }} />
                    </Box>
                ) : (
                    <div className="invoice-list">
                        {invoices.length === 0 ? (
                            <Typography textAlign="center" color="textSecondary" mt={4}>
                                ไม่พบรายการใบแจ้งหนี้
                            </Typography>
                        ) : (
                            invoices.map((inv) => (
                                <div key={inv.id} className="invoice-card">
                                    <div className="card-header">
                                        <span className="invoice-id">#{inv.id}</span>
                                        <span className={`invoice-status ${inv.isPaid ? 'status-paid' : 'status-pending'}`}>
                                            {inv.isPaid ? 'ชำระแล้ว' : 'รอชำระ'}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <div className="invoice-amount">
                                            ฿{inv.amount.toLocaleString()}
                                        </div>
                                        <div className="invoice-date">
                                            <CalendarTodayIcon fontSize="small" />
                                            วันที่: {new Date(inv.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                                        </div>
                                        {inv.description && (
                                            <Typography variant="caption" color="textSecondary" mt={1} display="block">
                                                {inv.description}
                                            </Typography>
                                        )}
                                    </div>
                                    <div className="card-footer">
                                        {inv.slipUrl ? (
                                            <>
                                                <img
                                                    src={inv.slipUrl}
                                                    alt="Slip"
                                                    className="slip-thumbnail"
                                                    onClick={() => handleOpenPreview(inv)}
                                                />
                                                {/* Allow re-upload only if needed, currently showing thumbnail implies done/review but let's allow it if status is not fully confirmed or just view */}
                                            </>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenUpload(inv)}
                                                startIcon={<PhotoCameraBackIcon />}
                                                sx={{ borderRadius: 50, px: 3 }}
                                            >
                                                อัปโหลดสลิป
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Modals */}
                {selectedInvoice && (
                    <>
                        <InvoiceUploadModal
                            open={uploadModalOpen}
                            onClose={() => setUploadModalOpen(false)}
                            invoiceId={selectedInvoice.id}
                            onSuccess={handleUploadSuccess}
                        />
                        <SlipPreviewModal
                            open={previewModalOpen}
                            onClose={() => setPreviewModalOpen(false)}
                            imageUrl={selectedInvoice.slipUrl}
                        />
                    </>
                )}
            </Container>
        </div>
    );
};

export default InvoiceScreen;