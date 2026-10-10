import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Modal,
    IconButton,
    useTheme,
    Backdrop,
    Fade,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import callApi from '../Services/callApi';
import ImageWithAuth from './ImageWithAuth';

export type NewsItem = {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    tag?: string;
    date?: string;
};

type Props = {
    news?: NewsItem[];
};

const NewsTickerWithModal: React.FC<Props> = ({ news }) => {
    const theme = useTheme();
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [apiNews, setApiNews] = useState<NewsItem[]>([]);

    const handleOpen = (item: NewsItem) => {
        setSelectedNews(item);
    };

    const handleClose = () => {
        setSelectedNews(null);
    };

    useEffect(() => {
        if (!news) {
            const fetchNews = async () => {
                try {
                    const response = await callApi.get('/News');
                    if (response.data && response.data.success && Array.isArray(response.data.data)) {
                        setApiNews(response.data.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch news from API:', error);
                }
            };
            fetchNews();
        }
    }, [news]);

    const displayNews = news || apiNews;

    if (!displayNews || displayNews.length === 0) {
        return null;
    }

    return (
        <Box p={2.5}>
            {/* Header section with modern line indicator */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                sx={{ width: '100%' }}
            >
                <Box display="flex" alignItems="center">
                    <Box
                        sx={{
                            width: 5,
                            height: 24,
                            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            borderRadius: '4px',
                            mr: 1.5,
                        }}
                    />
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#2c3e50', letterSpacing: '0.5px' }}>
                        ข่าวสารและโปรโมชั่น
                    </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    เลื่อนดูเพิ่มเติม →
                </Typography>
            </Box>

            {/* Scrolling list of cards */}
            <Box
                sx={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    gap: 2.5,
                    paddingY: 1.5,
                    paddingX: 0.5,
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none', // Hide standard scrollbar for clean UI
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {displayNews.map((item) => (
                    <Box
                        key={item.id}
                        onClick={() => handleOpen(item)}
                        sx={{
                            minWidth: '280px',
                            maxWidth: '280px',
                            scrollSnapAlign: 'start',
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(0, 0, 0, 0.04)',
                            flexShrink: 0,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                                '& img': {
                                    transform: 'scale(1.06)',
                                }
                            },
                        }}
                    >
                        {/* Image block with hover zoom */}
                        <Box sx={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                            <ImageWithAuth
                                src={item.imageUrl}
                                alt={item.title}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease',
                                }}
                            />
                            {/* Category Tag overlay */}
                            {(item.tag || "ข่าวสาร") && (
                                <Chip
                                    label={item.tag || "ข่าวสาร"}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                                        color: '#ffffff',
                                        fontWeight: 600,
                                        fontSize: '11px',
                                        borderRadius: '6px',
                                        height: '22px',
                                    }}
                                />
                            )}
                        </Box>

                        {/* Text details container */}
                        <Box p={2} sx={{ whiteSpace: 'normal' }}>
                            {item.date && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: '11px' }}>
                                    {item.date}
                                </Typography>
                            )}
                            <Typography 
                                variant="body1" 
                                fontWeight={600} 
                                sx={{ 
                                    color: '#2c3e50', 
                                    lineHeight: 1.3,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    height: '42px',
                                }}
                            >
                                {item.title}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Premium Centered Detail Dialog Modal */}
            <Modal
                open={!!selectedNews}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 300,
                        style: { backgroundColor: 'rgba(0, 0, 0, 0.45)' }
                    },
                }}
            >
                <Fade in={!!selectedNews}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '520px',
                            backgroundColor: '#ffffff',
                            borderRadius: '24px',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                            overflow: 'hidden',
                            outline: 'none',
                            p: 0,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Image Banner on Modal */}
                        {selectedNews && (
                            <Box sx={{ position: 'relative', height: 240 }}>
                                <ImageWithAuth
                                    src={selectedNews.imageUrl}
                                    alt={selectedNews.title}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                {/* Modern Translucent Close Button */}
                                <IconButton
                                    onClick={handleClose}
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#333333',
                                        '&:hover': {
                                            backgroundColor: '#ffffff',
                                            transform: 'scale(1.05)',
                                        },
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}

                        {/* Info details on Modal */}
                        {selectedNews && (
                            <Box p={3}>
                                <Box display="flex" gap={1.5} alignItems="center" mb={1.5}>
                                    {(selectedNews.tag || "ข่าวสาร") && (
                                        <Chip
                                            label={selectedNews.tag || "ข่าวสาร"}
                                            size="small"
                                            sx={{
                                                backgroundColor: `${theme.palette.secondary.main}15`,
                                                color: theme.palette.secondary.main,
                                                fontWeight: 700,
                                                fontSize: '12px',
                                                borderRadius: '6px',
                                            }}
                                        />
                                    )}
                                    {selectedNews.date && (
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            {selectedNews.date}
                                        </Typography>
                                    )}
                                </Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#2c3e50', lineHeight: 1.4 }}>
                                    {selectedNews.title}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'text.secondary', 
                                        lineHeight: 1.6, 
                                        whiteSpace: 'pre-line',
                                        mt: 1.5,
                                    }}
                                >
                                    {selectedNews.description}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default NewsTickerWithModal;

// Removed mock newsList fallback. Data is retrieved exclusively from the API.
