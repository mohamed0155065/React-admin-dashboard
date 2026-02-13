import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function InvoicesFAQ() {
    const theme = useTheme();
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" fontWeight={900} mb={4}>FAQ</Typography>
            <Box sx={{ maxWidth: '800px' }}>
                {[1, 2, 3].map((i) => (
                    <Accordion key={i} sx={{
                        bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: '8px !important',
                        '&:before': { display: 'none' }
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                            <Typography fontWeight={600}>Common Question #{i}?</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="body2" color="text.secondary">
                                This is the detailed answer for the question above, fully themed for dark and light modes.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
}