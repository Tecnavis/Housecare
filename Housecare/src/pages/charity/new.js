import React from 'react';
import { useLocation } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { GlobalWorkerOptions } from 'pdfjs-dist';

const PagesBlank = () => {
    const location = useLocation();
    const { pdfDataUrl } = location.state || {};

    if (!pdfDataUrl) {
        return <p>No PDF data received</p>;
    }

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // Set up pdfjs-dist worker URL to the local path
    GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <Worker workerUrl={GlobalWorkerOptions.workerSrc}>
                <Viewer
                    fileUrl={`data:application/pdf;base64,${pdfDataUrl}`}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
};

export default PagesBlank;
