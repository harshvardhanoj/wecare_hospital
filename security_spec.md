# Firebase Security Specification: WeCare Hospitals

## Data Invariants

1. **User Patient Profiles (`/users/{userId}`)**:
   - Access to user profiles is strictly private. Only the authenticated user matching the document ID (`request.auth.uid == userId`) may read or write their own profile card.
   - User profile deletion is blocked client-side.
   - Profile emails are immutable after creation.
   - Basic fields (id, name, email) are mandatory and bounded in length.

2. **Clinic Appointments (`/appointments/{appointmentId}`)**:
   - Only authenticated users can register an appointment, and the `userId` in the payload must match their authentic user UID (`request.resource.data.userId == request.auth.uid`).
   - A user may only see (`get` or `list` query) appointments that belong directly to them (`resource.data.userId == request.auth.uid`).
   - Users cannot edit core appointment structures (e.g., date, doctor, reason) once scheduled. They may ONLY update the booking's `status` to `'cancelled'` using a targeted transition.
   - Appointment fields are strongly typed, validated, and bounded to prevent resource depletion ("Denial of Wallet") attacks.

---

## The "Dirty Dozen" Threat Payloads

The following 12 scenarios represent security intrusion efforts that WeCare security policy will block:

1. **Identity Spoofing - Read Profile**: User `A(uid="user_A_123")` attempts to `get` the profile document of User `B(uid="user_B_456")`. (Expected: *PERMISSION_DENIED*)
2. **Identity Spoofing - Create Profile**: Unauthenticated request tries to `create` a profile document in `/users/hacker_uid`. (Expected: *PERMISSION_DENIED*)
3. **Ghost Field Write**: Attacker tries to inject high-privilege field `{"isAdmin": true, "isVerified": true}` into their profile document. (Expected: *PERMISSION_DENIED* due to validation)
4. **Email Mutable Edit**: Authenticated user attempts to modify their profile email address. (Expected: *PERMISSION_DENIED*)
5. **PII Query Scraping**: Authenticated user attempts a collection group or loose `list` query across `/users` without restricted ownership query matching. (Expected: *PERMISSION_DENIED*)
6. **Unauthenticated Session Booking**: Unauthenticated guest attempts to write an appointment ticket to `/appointments/apt-999`. (Expected: *PERMISSION_DENIED*)
7. **Appointment Forgery**: Authenticated User `A(uid="user_A")` attempts to book an appointment with `userId: "user_B"` to overload User B's billing records. (Expected: *PERMISSION_DENIED*)
8. **Malicious Query Scraping**: Authenticated User `A(uid="user_A")` attempts to retrieve appointments where `userId == "user_B"`. (Expected: *PERMISSION_DENIED*)
9. **State Modification Forgery**: Contributor logs in and attempts to update the `doctorName` or `consultFee` of an existing appointment ticket. (Expected: *PERMISSION_DENIED*)
10. **Data Type Poisoning**: Attacker passes an integer `1337` instead of a string value for the department name in an appointment payload. (Expected: *PERMISSION_DENIED*)
11. **Denial of Wallet - Size Overload**: Attacker passes a `10MB` reason string to stress cloud database indexes. (Expected: *PERMISSION_DENIED*)
12. **Status Privilege Escalation**: User attempts to switch check status field to `'completed'` on their own appointment. (Expected: *PERMISSION_DENIED*)

---

## Test Runner Schema Reference

See `firestore.rules` for implementation of rules.
