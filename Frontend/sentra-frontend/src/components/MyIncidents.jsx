import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../pages/MyIncidents.css";

export default function MyIncidents() {
  const { token } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const fetchMyIncidents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/incidents/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIncidents(res.data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyIncidents();
  }, [token]);

  if (loading) {
    return <p className="loading-text">Loading incidents...</p>;
  }

  return (
    <div className="incidents-container">
      <h3 className="incidents-title">My Submitted Incidents</h3>

      {incidents.length === 0 ? (
        <p className="no-incidents">No incidents submitted yet.</p>
      ) : (
        incidents.map((incident) => (
          <div key={incident._id} className="incident-card">
            <div className="incident-header">
              <p>
                <strong>Reference ID:</strong>{" "}
                <span className="incident-ref">{incident.referenceId}</span>
              </p>
              
              <span className={`status-badge ${incident.status.toLowerCase().replace(" ", "-")}`}>
                {incident.status}
              </span>
            </div>

            <p>
              <strong>Type:</strong> {incident.incidentType}
            </p>

            <p>
              <strong>Location:</strong> {incident.location}
            </p>

            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(incident.dateTime).toLocaleString()}
            </p>

            <p>
              <strong>Description:</strong> {incident.description}
            </p>

            <hr />

            <div className="accused-section">
              <h4>Accused Person</h4>
              <p>
                <strong>Name:</strong> {incident.accused?.name || "N/A"}
              </p>

              <p>
                <strong>Role:</strong> {incident.accused?.role || "N/A"}
              </p>

              {incident.accused?.department && (
                <p>
                  <strong>Department:</strong> {incident.accused.department}
                </p>
              )}

              {incident.accused?.relationship && (
                <p>
                  <strong>Relationship:</strong> {incident.accused.relationship}
                </p>
              )}
            </div>

            <hr />

            <p>
              <strong>Submitted As:</strong>{" "}
              {incident.isAnonymous ? (
                <span className="anonymous-badge">Anonymous</span>
              ) : (
                "Non-anonymous"
              )}
            </p>

            <p>
              <strong>Submitted On:</strong>{" "}
              {new Date(incident.createdAt).toLocaleString()}
            </p>

            {incident.status === "Closed" && incident.resolution?.notes && (
              <div className="resolution-section">
                <h4>📋 Resolution</h4>
                <p className="resolution-text">{incident.resolution.notes}</p>
                <p className="resolution-date">
                  Resolved on: {new Date(incident.resolution.resolvedAt).toLocaleString()}
                </p>
              </div>
            )}

            <button 
              className="view-details-btn"
              onClick={() => setSelectedIncident(incident)}
            >
              View Full Details
            </button>
          </div>
        ))
      )}

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Incident Details</h3>
            
            <div className="modal-content">
              <p>
                <strong>Reference ID:</strong> {selectedIncident.referenceId}
              </p>
              
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${selectedIncident.status.toLowerCase().replace(" ", "-")}`}>
                  {selectedIncident.status}
                </span>
              </p>

              <p>
                <strong>Type:</strong> {selectedIncident.incidentType}
              </p>

              <p>
                <strong>Location:</strong> {selectedIncident.location}
              </p>

              <p>
                <strong>Date & Time:</strong>{" "}
                {new Date(selectedIncident.dateTime).toLocaleString()}
              </p>

              <hr />

              <h4>Description</h4>
              <p className="description-text">{selectedIncident.description}</p>

              {/* ========== EVIDENCE SECTION ========== */}
              {selectedIncident.evidence && selectedIncident.evidence.length > 0 && (
                <>
                  <hr />
                  <h4>Evidence ({selectedIncident.evidence.length})</h4>
                  <div className="evidence-section">
                    <div className="evidence-grid">
                      {selectedIncident.evidence.map((item, index) => {
                        const isPDF = item.type === 'pdf';
                        const isImage = item.type === 'image';
                        
                        // Function to get Cloudinary PDF page preview
                        const getPdfPreviewUrl = (pdfUrl) => {
                          if (!pdfUrl.includes('cloudinary')) return null;
                          
                          // Cloudinary transformation: get first page as image
                          const firstPageUrl = pdfUrl.replace('/upload/', '/upload/pg_1/');
                          return firstPageUrl;
                        };
                        
                        // Handle PDF preview
                        const handlePDFPreview = (url) => {
                          const previewUrl = getPdfPreviewUrl(url);
                          
                          const newWindow = window.open('', '_blank');
                          newWindow.document.write(`
                            <html>
                              <head>
                                <title>PDF Evidence Preview</title>
                                <style>
                                  * { margin: 0; padding: 0; box-sizing: border-box; }
                                  body { 
                                    font-family: 'Segoe UI', Arial, sans-serif; 
                                    background: #f5f5f5;
                                    min-height: 100vh;
                                    display: flex;
                                    flex-direction: column;
                                  }
                                  .pdf-viewer-container {
                                    flex: 1;
                                    display: flex;
                                    flex-direction: column;
                                    max-width: 1000px;
                                    margin: 0 auto;
                                    width: 100%;
                                    padding: 20px;
                                  }
                                  .pdf-header {
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    padding: 20px;
                                    border-radius: 8px;
                                    margin-bottom: 20px;
                                  }
                                  .pdf-header h1 {
                                    margin: 0 0 10px 0;
                                    font-size: 24px;
                                  }
                                  .pdf-controls {
                                    display: flex;
                                    gap: 10px;
                                    margin-top: 15px;
                                    flex-wrap: wrap;
                                  }
                                  .pdf-btn {
                                    padding: 8px 16px;
                                    background: #3498db;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    text-decoration: none;
                                    display: inline-block;
                                    font-size: 14px;
                                  }
                                  .pdf-btn.download {
                                    background: #27ae60;
                                  }
                                  .pdf-btn:hover {
                                    opacity: 0.9;
                                  }
                                  .pdf-preview-area {
                                    background: white;
                                    padding: 20px;
                                    border-radius: 8px;
                                    text-align: center;
                                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                  }
                                  .pdf-page-container {
                                    margin-bottom: 20px;
                                  }
                                  .pdf-page-container img {
                                    max-width: 100%;
                                    max-height: 70vh;
                                    border: 1px solid #ddd;
                                    border-radius: 4px;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                  }
                                  .page-label {
                                    margin-top: 10px;
                                    color: #666;
                                    font-size: 14px;
                                  }
                                  .pdf-instructions {
                                    background: #fff8e1;
                                    border-left: 4px solid #ffc107;
                                    padding: 20px;
                                    margin-top: 20px;
                                    border-radius: 4px;
                                    text-align: left;
                                  }
                                  .pdf-instructions h3 {
                                    color: #d68910;
                                    margin-bottom: 10px;
                                  }
                                  .pdf-instructions ol {
                                    margin-left: 20px;
                                    margin-bottom: 15px;
                                  }
                                  .pdf-instructions li {
                                    margin-bottom: 8px;
                                    line-height: 1.5;
                                  }
                                  .direct-link {
                                    color: #3498db;
                                    text-decoration: underline;
                                    font-weight: 500;
                                  }
                                </style>
                              </head>
                              <body>
                                <div class="pdf-viewer-container">
                                  <div class="pdf-header">
                                    <h1>PDF Evidence Preview</h1>
                                    <p>First page preview</p>
                                    <div class="pdf-controls">
                                      <a href="${url}" class="pdf-btn download" download="evidence.pdf">
                                        📥 Download Full PDF
                                      </a>
                                      <button class="pdf-btn" onclick="window.print()">🖨️ Print</button>
                                      <button class="pdf-btn" onclick="window.close()">✕ Close</button>
                                    </div>
                                  </div>
                                  
                                  <div class="pdf-preview-area">
                                    ${previewUrl ? `
                                      <div class="pdf-page-container">
                                        <img src="${previewUrl}" alt="PDF Page 1 Preview" />
                                        <div class="page-label">📄 Page 1 Preview</div>
                                        <p style="margin-top: 10px; color: #666;">
                                          <small>This is a preview. Download the full PDF for complete document.</small>
                                        </p>
                                      </div>
                                    ` : `
                                      <div class="pdf-instructions">
                                        <h3>📄 PDF Document Available</h3>
                                        <p>To view this evidence:</p>
                                        <ol>
                                          <li>Click "Download Full PDF" button above</li>
                                          <li>Save the file to your device</li>
                                          <li>Open with any PDF viewer</li>
                                        </ol>
                                        <p style="margin-top: 15px;">
                                          <a href="${url}" class="direct-link" download="evidence.pdf">
                                            🔗 Direct download link
                                          </a>
                                        </p>
                                      </div>
                                    `}
                                  </div>
                                </div>
                              </body>
                            </html>
                          `);
                          newWindow.document.close();
                        };
                        
                        // Handle image fullscreen
                        const handleImageFullscreen = (url) => {
                          const newWindow = window.open('', '_blank');
                          newWindow.document.write(`
                            <html>
                              <head>
                                <title>Image Evidence</title>
                                <style>
                                  body {
                                    margin: 0;
                                    padding: 20px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    min-height: 100vh;
                                    background: #f5f5f5;
                                  }
                                  img {
                                    max-width: 90%;
                                    max-height: 90vh;
                                    border: 1px solid #ddd;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                  }
                                  .controls {
                                    position: fixed;
                                    top: 10px;
                                    right: 10px;
                                    z-index: 1000;
                                  }
                                  button {
                                    padding: 8px 16px;
                                    margin-left: 10px;
                                    background: #3498db;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                  }
                                  button:hover {
                                    background: #2980b9;
                                  }
                                </style>
                              </head>
                              <body>
                                <div class="controls">
                                  <button onclick="window.location.href='${url}'" download>Download</button>
                                  <button onclick="window.print()">Print</button>
                                  <button onclick="window.close()">Close</button>
                                </div>
                                <img src="${url}" alt="Evidence Image" />
                              </body>
                            </html>
                          `);
                          newWindow.document.close();
                        };

                        
                        return (
                          <div key={index} className={`evidence-item ${isPDF ? 'pdf-type' : 'image-type'}`}>
                            <div 
                              className="evidence-preview"
                              onClick={() => isPDF ? handlePDFPreview(item.url) : handleImageFullscreen(item.url)}
                            >
                              {isPDF ? (
                                <>
                                  <div className="evidence-icon pdf-icon">📄</div>
                                  <div className="evidence-type-label">PDF Document</div>
                                  <div className="evidence-preview-hint">Click to preview first page</div>
                                </>
                              ) : (
                                <>
                                  <img 
                                    src={item.url} 
                                    alt={`Evidence ${index + 1}`}
                                    className="evidence-thumbnail"
                                  />
                                  <div className="evidence-overlay">
                                    <span className="view-full-label">🔍 Click to view</span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="evidence-actions">
                              <button 
                                className="evidence-download-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageFullscreen(item.url);
                                }}
                              >
                                <span className="download-icon">⬇️</span>
                                Download
                              </button>
                              
                              {isPDF && (
                                <button 
                                  className="evidence-preview-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePDFPreview(item.url);
                                  }}
                                >
                                  <span className="preview-icon">👁️</span>
                                  Preview
                                </button>
                              )}
                            </div>
                            
                            <div className="evidence-info">
                              <div className="evidence-index">#{index + 1}</div>
                              <div className="evidence-type">
                                {isPDF ? 'PDF' : 'Image'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
              {/* ========== END EVIDENCE SECTION ========== */}

              <hr />

              <h4>Accused Person</h4>
              <p>
                <strong>Name:</strong> {selectedIncident.accused?.name || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {selectedIncident.accused?.role || "N/A"}
              </p>
              {selectedIncident.accused?.department && (
                <p>
                  <strong>Department:</strong> {selectedIncident.accused.department}
                </p>
              )}
              {selectedIncident.accused?.relationship && (
                <p>
                  <strong>Relationship:</strong> {selectedIncident.accused.relationship}
                </p>
              )}

              <hr />

              <p>
                <strong>Submitted As:</strong>{" "}
                {selectedIncident.isAnonymous ? (
                  <span className="anonymous-badge">Anonymous</span>
                ) : (
                  "Non-anonymous"
                )}
              </p>

              <p>
                <strong>Submitted On:</strong>{" "}
                {new Date(selectedIncident.createdAt).toLocaleString()}
              </p>

              {selectedIncident.status === "Closed" && selectedIncident.resolution?.notes && (
                <>
                  <hr />
                  <div className="resolution-section">
                    <h4>📋 Resolution</h4>
                    <p className="resolution-text">{selectedIncident.resolution.notes}</p>
                    <p className="resolution-date">
                      Resolved by: {selectedIncident.resolution.resolvedBy}
                    </p>
                    <p className="resolution-date">
                      Resolved on: {new Date(selectedIncident.resolution.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>

            <button className="close-btn" onClick={() => setSelectedIncident(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}