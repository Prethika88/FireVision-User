// Backend/services/reportVerifier.js
import { getDistance } from "geolib";

class ReportVerifier {
  verifyReport(extractedInfo, nearbyReports) {
    let confidence = 0.5;
    let status = "pending";
    let similarCount = 0;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    nearbyReports.forEach(report => {
      if (new Date(report.timestamp) > oneHourAgo) {
        const reportKeywords = new Set(
          report.extractedInfo?.keywords || []
        );
        const newKeywords = new Set(
          extractedInfo?.keywords || []
        );

        let overlap = 0;
        newKeywords.forEach(keyword => {
          if (reportKeywords.has(keyword)) overlap++;
        });

        if (overlap >= 2) {
          similarCount++;
          confidence += 0.15;
        }
      }
    });

    if (extractedInfo?.urgencyScore >= 8) {
      confidence += 0.1;
    }

    if (extractedInfo?.location?.length > 20) {
      confidence += 0.05;
    }

    if (similarCount >= 2) {
      status = "verified";
      confidence = Math.min(confidence + 0.2, 1.0);
    }

    if (extractedInfo?.hasCasualties) {
      status = "verified";
      confidence = 0.9;
    }

    return {
      status,
      confidence: Math.min(confidence, 1.0),
      similarReportsCount: similarCount,
      verifiedBy: []
    };
  }

  assignCluster(newLocation, nearbyReports) {
    const EPSILON_KM = 0.5; // 500 meters

    if (!nearbyReports || nearbyReports.length === 0) {
      return `cluster_${newLocation.latitude.toFixed(4)}_${newLocation.longitude.toFixed(4)}`;
    }

    let minDistance = Infinity;
    let closestCluster = null;

    nearbyReports.forEach(report => {
      const coords = report?.reporter?.location?.coordinates;
      if (!coords) return;

      const distance =
        getDistance(
          { latitude: newLocation.latitude, longitude: newLocation.longitude },
          { latitude: coords[1], longitude: coords[0] }
        ) / 1000;

      if (distance < minDistance && distance < EPSILON_KM) {
        minDistance = distance;
        closestCluster = report.geoCluster?.clusterId;
      }
    });

    return (
      closestCluster ||
      `cluster_${newLocation.latitude.toFixed(4)}_${newLocation.longitude.toFixed(4)}`
    );
  }
}

export default new ReportVerifier();
