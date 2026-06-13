import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import JournalListPage from "./pages/content/JournalListPage";
import NewsletterListPage from "./pages/content/NewsletterListPage";
import ContentDetailsPage from "./pages/content/ContentDetailsPage";
import MyContentPage from "./pages/content/MyContentPage";
import CreateContentPage from "./pages/content/CreateContentPage";
import EventListPage from "./pages/events/EventListPage";
import CreateEventPage from "./pages/events/CreateEventPage";
import EditEventPage from "./pages/events/EditEventPage";
import CreateEventFormPage from "./pages/events/CreateEventFormPage";
import DevoteeEventDetailsPage from "./pages/events/DevoteeEventDetailsPage";
import MyEventsPage from "./pages/events/MyEventsPage";
import ScanQrPage from "./pages/events/ScanQrPage";
import PublicEventDetailsPage from "./pages/events/PublicEventDetailsPage";
import EventRegistrationPage from "./pages/events/EventRegistrationPage";
import MyRegisteredEventsPage from "./pages/events/MyRegisteredEventsPage";
import DailyProgressPage from "./pages/progress/DailyProgressPage";
import TrackProgressPage from "./pages/progress/TrackProgressPage";
import HomePage from "./pages/home/HomePage";
import AboutIskconAhmedabadPage from "./pages/about/AboutIskconAhmedabadPage";
import AboutPrabhupadaPage from "./pages/about/AboutPrabhupadaPage";
import DonatePage from "./pages/donations/DonatePage";
import NotFoundPage from "./pages/error/NotFoundPage";
import ErrorPage from "./pages/error/ErrorPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import EditContentPage from "./pages/content/EditContentPage";
import ContentSubscriptionPlansPage from "./pages/content/ContentSubscriptionPlansPage";
import ProfilePage from "./pages/profile/ProfilePage";
import TripsPage from "./pages/trips/TripsPage";
import TripDetailsPage from "./pages/trips/TripDetailsPage";
import RegisteredTripsPage from "./pages/trips/RegisteredTripsPage";
import CreateTripPage from "./pages/trips/CreateTripPage";
import EditTripPage from "./pages/trips/EditTripPage";
import MyCreatedTripsPage from "./pages/trips/MyCreatedTripsPage";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseDetailsPage from "./pages/courses/CourseDetailsPage";
import RegisteredCoursesPage from "./pages/courses/RegisteredCoursesPage";
import CreateCoursePage from "./pages/courses/CreateCoursePage";
import EditCoursePage from "./pages/courses/EditCoursePage";
import MyCreatedCoursesPage from "./pages/courses/MyCreatedCoursesPage";
import CourseRegistrationsPage from "./pages/courses/CourseRegistrationsPage";
import FestivalCalendarPage from "./pages/festivals/FestivalCalendarPage";
import BackToTopButton from "./components/common/BackToTopButton";
import AdminDevoteeRequestsPage from "./pages/admin/AdminDevoteeRequestsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminTripsPage from "./pages/admin/AdminTripsPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminSubscriptionsPage from "./pages/admin/AdminSubscriptionsPage";
import AdminDonationsPage from "./pages/admin/AdminDonationsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import EventRegistrationManagePage from "./pages/events/EventRegistrationManagePage";

import TripRegistrationManagePage from "./pages/trips/TripRegistrationManagePage";
import TripRegistrationsPage from "./pages/trips/TripRegistrationsPage";
import CourseRegistrationManagePage from "./pages/courses/CourseRegistrationManagePage";
import EventUserRegistrationsPage from "./pages/events/EventUserRegistrationPage";
import ReportProblemPage from "./pages/support/ReportProblemPage";
import ContactPage from "./pages/support/ContactPage";
import GetAppPage from "./pages/get-app/GetAppPage";
import InstagramFeedPage from "./pages/instagram-feed/InstagramFeedPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/:roleType" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/about" element={<AboutIskconAhmedabadPage />} />
          <Route path="/about/prabhupada" element={<AboutPrabhupadaPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/festivals" element={<FestivalCalendarPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/:uuid" element={<PublicEventDetailsPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/:uuid" element={<TripDetailsPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/journals" element={<JournalListPage />} />
          <Route path="/newsletters" element={<NewsletterListPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:uuid" element={<CourseDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/report-problem" element={<ReportProblemPage />} />
          <Route path="/get-app" element={<GetAppPage />} />
          <Route path="/social-feed" element={<InstagramFeedPage />} />
             
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Route>

        <Route
          path="/meta-idx"
          element={<RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}
        >
          <Route element={<MainLayout />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route
                path="devotee-requests"
                element={<AdminDevoteeRequestsPage />}
              />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="trips" element={<AdminTripsPage />} />
              <Route path="courses" element={<AdminCoursesPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route
                path="subscriptions"
                element={<AdminSubscriptionsPage />}
              />
              <Route path="donations" element={<AdminDonationsPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route element={<RoleRoute allowedRoles={["SEEKER", "DEVOTEE"]} />}>
               <Route path="/content/:uuid" element={<ContentDetailsPage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["DEVOTEE"]} />}>
              <Route
                path="/content/author/:uuid"
                element={<ContentDetailsPage />}
              />
              <Route path="/content/manage" element={<MyContentPage />} />
              <Route path="/content/create" element={<CreateContentPage />} />
              <Route path="/content/:uuid/edit" element={<EditContentPage />} />
            </Route>
            <Route element={<RoleRoute allowedRoles={["DEVOTEE"]} />}>
              <Route path="/events/create" element={<CreateEventPage />} />
              <Route path="/events/:uuid/edit" element={<EditEventPage />} />
              <Route
                path="/events/:uuid/form"
                element={<CreateEventFormPage />}
              />
              <Route
                path="/events/manage-registrations"
                element={<EventRegistrationManagePage />}
              />

              <Route
                path="/events/:uuid/registrations"
                element={<EventUserRegistrationsPage />}
              />
              <Route
                path="/events/:uuid/details"
                element={<DevoteeEventDetailsPage />}
              />
              <Route path="/events/my-events" element={<MyEventsPage />} />
              <Route path="/events/scan-qr" element={<ScanQrPage />} />
              <Route path="/trips/create" element={<CreateTripPage />} />
              <Route path="/trips/:uuid/edit" element={<EditTripPage />} />
              <Route
                path="/trips/my-created"
                element={<MyCreatedTripsPage />}
              />
              <Route
                path="/trips/manage-registrations"
                element={<TripRegistrationManagePage />}
              />

              <Route
                path="/trips/:uuid/registrations"
                element={<TripRegistrationsPage />}
              />
              <Route path="/courses/create" element={<CreateCoursePage />} />
              <Route path="/courses/:uuid/edit" element={<EditCoursePage />} />
              <Route
                path="/courses/my-created"
                element={<MyCreatedCoursesPage />}
              />
              <Route
                path="/courses/manage-registrations"
                element={<CourseRegistrationManagePage />}
              />

              <Route
                path="/courses/:uuid/registrations"
                element={<CourseRegistrationsPage />}
              />
              {/* <Route
                path="/courses/:uuid/registrations"
                element={<CourseRegistrationsPage />}
              /> */}
            </Route>
            
            <Route
              path="/events/:uuid/register"
              element={<EventRegistrationPage />}
            />
            <Route
              path="/events/my-registrations"
              element={<MyRegisteredEventsPage />}
            />
            <Route path="/progress/daily" element={<DailyProgressPage />} />
            <Route path="/progress/track" element={<TrackProgressPage />} />
            
            <Route
              path="/content/subscriptions"
              element={<ContentSubscriptionPlansPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/trips/my-registrations"
              element={<RegisteredTripsPage />}
            />
            <Route
              path="/courses/my-registered"
              element={<RegisteredCoursesPage />}
            />
          </Route>
        </Route>
      </Routes>
      <BackToTopButton />
    </BrowserRouter>
  );
}
