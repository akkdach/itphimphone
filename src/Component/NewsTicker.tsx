import React, { useState } from 'react';
import {
    Box,
    Typography,
    Modal,
    IconButton,
    CardMedia,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type NewsItem = {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
};

type Props = {
    news?: NewsItem[];
};

const NewsTickerWithModal: React.FC<Props> = ({ news }) => {
    const theme = useTheme();
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    const handleOpen = (item: NewsItem) => {
        setSelectedNews(item);
    };

    const handleClose = () => {
        setSelectedNews(null);
    };

    return (
        <Box p={2}>
            {/* News List */}
            <Box
                display="flex"
                alignItems="center"
                mb={2}
                sx={{ width: '100%' }}
            >
                <Box
                    sx={{
                        width: 6,
                        height: 24,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 1,
                        mr: 1.5,
                    }}
                />
                <Typography variant="h6" fontWeight={600}>
                    ข่าวสาร
                </Typography>
            </Box>
            <Box
                sx={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    gap: 2,
                    paddingY: 1,
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >

                {newsList.map((item) => (
                    <Box
                        key={item.id}
                        onClick={() => handleOpen(item)}
                        sx={{
                            minWidth: '250px',
                            scrollSnapAlign: 'start',
                            backgroundColor: theme.palette.primary.main,
                            color: '#fff',
                            padding: 1,
                            borderRadius: 2,
                            boxShadow: 1,
                            flexShrink: 0,
                            cursor: 'pointer',
                        }}
                    >
                        <Box
                            component="img"
                            src={item.imageUrl}
                            alt={item.title}
                            sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 1,
                                mb: 1,
                            }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                            {item.title}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Fullscreen Modal */}
            <Modal open={!!selectedNews} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '95vw',
                        height: '100vh',
                        backgroundColor: '#fff',
                        zIndex: 1300,
                        overflowY: 'auto',
                        p: 2,
                    }}
                >
                    <Box display="flex" justifyContent="flex-end">
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {selectedNews && (
                        <Box>
                            <CardMedia
                                component="img"
                                image={selectedNews.imageUrl}
                                alt={selectedNews.title}
                                sx={{
                                    width: '100%',
                                    maxHeight: 300,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            />
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                {selectedNews.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {selectedNews.description}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default NewsTickerWithModal;

const newsList = [
    {
        id: 1,
        title: 'เปิดตัว MacBook Air M4 รุ่นใหม่ล่าสุด',
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/th/feature/166600108/th-feature-galaxy-tab-a11-sm-x130-549460230?$FB_TYPE_K_JPG$',
        description: 'MacBook Air รุ่นใหม่มาพร้อมชิป M4 และดีไซน์บางเฉียบ...',
    },
    {
        id: 2,
        title: 'โปรโมชั่นผ่อน 0% นานสูงสุด 24 เดือน',
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/th/feature/166600108/th-feature-galaxy-tab-a11-sm-x130-549460230?$FB_TYPE_K_JPG$',
        description: 'รับสิทธิ์ผ่อนสินค้าแบบไม่มีดอกเบี้ยนานสูงสุด 24 เดือน...',
    },
];
