# apps/accounts/urls.py
from django.urls import path
from accounts import views

urlpatterns = [
    # Basic auth
     path("register/", views.RegisterView.as_view(), name="auth-register"),
    path("login/", views.LoginView.as_view(), name="auth-login"),
    path("logout/", views.LogoutView.as_view(), name="auth-logout"),
    # Rotate & refresh
    path("token/refresh/", views.TokenRefreshRotateView.as_view(), name="token-refresh-rotate"),
    # Invite & accept
    path("invite/", views.InviteCreateView.as_view(), name="invite-create"),
    path("invite/accept/", views.AcceptInviteView.as_view(), name="invite-accept"),
    # password reset
    path("password/reset/request/", views.RequestPasswordResetView.as_view(), name="password-reset-request"),
    path("password/reset/confirm/", views.ConfirmPasswordResetView.as_view(), name="password-reset-confirm"),
    # verify email
    path("verify-email/", views.VerifyEmailView.as_view(), name="verify-email"),
    # sessions
    path("sessions/", views.SessionsListView.as_view(), name="sessions-list"),
    # admin revoke user sessions
    # path("admin/revoke-user/<uuid:user_id>/", views.revoke_user_sessions, name="admin-revoke-user"),

    path("me/", views.UserView.as_view(), name="auth-user"),
    path("users/<uuid:user_id>/", views.UserDetailView.as_view(), name="user-detail"),
]
