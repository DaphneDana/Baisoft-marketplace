from decimal import Decimal

from django.core.management.base import BaseCommand
from accounts.models import Business, Role, User
from products.models import Product


class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **options):
        # Create roles
        roles = {}
        for name, desc in [
            (Role.ADMIN, 'Full access to all features'),
            (Role.EDITOR, 'Can create and edit products'),
            (Role.APPROVER, 'Can approve or reject products'),
            (Role.VIEWER, 'Read-only access'),
        ]:
            role, _ = Role.objects.get_or_create(name=name, defaults={'description': desc})
            roles[name] = role

        self.stdout.write(self.style.SUCCESS('Roles created'))

        # Create businesses
        acme, _ = Business.objects.get_or_create(
            name='Acme Corp',
            defaults={'description': 'A leading provider of innovative products'},
        )
        globex, _ = Business.objects.get_or_create(
            name='Globex Inc',
            defaults={'description': 'Global excellence in technology'},
        )

        self.stdout.write(self.style.SUCCESS('Businesses created'))

        # Create users
        users_data = [
            ('acme_admin', 'admin@acme.com', 'Admin', 'User', acme, roles[Role.ADMIN]),
            ('acme_editor', 'editor@acme.com', 'Editor', 'User', acme, roles[Role.EDITOR]),
            ('acme_approver', 'approver@acme.com', 'Approver', 'User', acme, roles[Role.APPROVER]),
            ('acme_viewer', 'viewer@acme.com', 'Viewer', 'User', acme, roles[Role.VIEWER]),
            ('globex_admin', 'admin@globex.com', 'Globex', 'Admin', globex, roles[Role.ADMIN]),
        ]

        created_users = {}
        for username, email, first, last, business, role in users_data:
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password='password123',
                    first_name=first,
                    last_name=last,
                    business=business,
                    role=role,
                )
                created_users[username] = user
            else:
                created_users[username] = User.objects.get(username=username)

        self.stdout.write(self.style.SUCCESS('Users created'))

        # Create products
        products_data = [
            ('Widget Pro', 'High-quality professional widget', Decimal('29.99'),
             Product.APPROVED, acme, created_users['acme_admin']),
            ('Gadget Plus', 'Advanced gadget with premium features', Decimal('49.99'),
             Product.PENDING_APPROVAL, acme, created_users['acme_editor']),
            ('Tool Basic', 'Essential tool for everyday use', Decimal('9.99'),
             Product.DRAFT, acme, created_users['acme_editor']),
            ('Globex Device', 'Cutting-edge technology device', Decimal('99.99'),
             Product.APPROVED, globex, created_users['globex_admin']),
        ]

        for name, desc, price, st, business, creator in products_data:
            Product.objects.get_or_create(
                name=name,
                business=business,
                defaults={
                    'description': desc,
                    'price': price,
                    'status': st,
                    'created_by': creator,
                },
            )

        self.stdout.write(self.style.SUCCESS('Products created'))
        self.stdout.write(self.style.SUCCESS('Seed data loaded successfully!'))
