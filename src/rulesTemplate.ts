export const FIRESTORE_RULES_TEMPLATE = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Catch-all Default-Deny Security Gate
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper Primitives
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() && request.auth.token.email == 'harsharya622004@gmail.com';
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function incoming() {
      return request.resource.data;
    }

    function existing() {
      return resource.data;
    }

    // Collection: Users (Patient profiles)
    match /users/{userId} {
      allow read, write: if isAdmin();
      allow get: if isOwner(userId);
      allow create: if isOwner(userId) && isValidUser(incoming());
      allow update: if isOwner(userId) && isValidUser(incoming()) && (
        incoming().email == existing().email && 
        incoming().id == existing().id &&
        incoming().diff(existing()).affectedKeys().hasAny(['name', 'phone', 'age', 'bloodType', 'allergies', 'gender', 'emergencyContact', 'height', 'weight'])
      );
      allow delete: if false; // Block profile deletes client-side
    }

    // Collection: Appointments (Clinic bookings)
    match /appointments/{appointmentId} {
      allow read, write: if isAdmin();
      allow get: if isSignedIn() && existing().userId == request.auth.uid;
      allow list: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && incoming().userId == request.auth.uid && isValidAppointment(incoming());
      allow update: if isSignedIn() && existing().userId == request.auth.uid && (
        // Only allow status transition (e.g. canceling appointment) via client-side write
        incoming().diff(existing()).affectedKeys().hasOnly(['status']) &&
        (incoming().status == 'cancelled')
      );
      allow delete: if false; // Bookings cannot be physically deleted client-side, only cancelled
    }

    // Validation Schemas
    function isValidUser(data) {
      return data.id is string && data.id.size() >= 5 && data.id.size() <= 128
          && data.name is string && data.name.size() >= 2 && data.name.size() <= 100
          && data.email is string && data.email.size() >= 5 && data.email.size() <= 100
          && (data.phone == null || (data.phone is string && data.phone.size() <= 30))
          && (data.age == null || (data.age is int && data.age >= 0 && data.age <= 130))
          && (data.bloodType == null || (data.bloodType is string && data.bloodType.size() <= 30))
          && (data.allergies == null || (data.allergies is list && data.allergies.size() <= 50))
          && (data.gender == null || (data.gender is string && data.gender.size() <= 30))
          && (data.height == null || (data.height is int || data.height is float))
          && (data.weight == null || (data.weight is int || data.weight is float));
    }

    function isValidAppointment(data) {
      return data.id is string && data.id.size() >= 5 && data.id.size() <= 100
          && data.userId is string && data.userId.size() >= 5 && data.userId.size() <= 128
          && data.doctorId is string && data.doctorId.size() >= 3 && data.doctorId.size() <= 100
          && data.doctorName is string && data.doctorName.size() >= 2 && data.doctorName.size() <= 100
          && data.departmentId is string && data.departmentId.size() >= 3 && data.departmentId.size() <= 105
          && data.departmentName is string && data.departmentName.size() >= 3 && data.departmentName.size() <= 105
          && data.patientName is string && data.patientName.size() >= 2 && data.patientName.size() <= 100
          && data.patientEmail is string && data.patientEmail.size() >= 5 && data.patientEmail.size() <= 100
          && data.patientPhone is string && data.patientPhone.size() >= 5 && data.patientPhone.size() <= 30
          && data.patientType is string && (data.patientType == 'new' || data.patientType == 'returning')
          && data.date is string && data.date.size() <= 20
          && data.timeSlot is string && data.timeSlot.size() <= 50
          && data.status is string && (data.status == 'scheduled' || data.status == 'completed' || data.status == 'cancelled')
          && data.reason is string && data.reason.size() <= 1000
          && data.createdAt is string && data.createdAt.size() <= 100;
    }
  }
}
`;
