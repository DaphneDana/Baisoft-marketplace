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
            ('Widget Pro', 'High-quality professional widget for enterprise teams. Built with precision engineering and designed for maximum productivity.',
             Decimal('29.99'), Product.APPROVED, acme, created_users['acme_admin'],
             'https://picsum.photos/seed/widget/600/400'),
            ('Gadget Plus', 'Advanced gadget with premium features and seamless integration. Perfect for modern workflows.',
             Decimal('49.99'), Product.PENDING_APPROVAL, acme, created_users['acme_editor'],
             'https://picsum.photos/seed/gadget/600/400'),
            ('Tool Basic', 'Essential tool for everyday use. Simple, reliable, and affordable for teams of any size.',
             Decimal('9.99'), Product.DRAFT, acme, created_users['acme_editor'],
             'https://picsum.photos/seed/tool/600/400'),
            ('Globex Device', 'Cutting-edge technology device powered by next-gen AI. Redefining what\'s possible.',
             Decimal('99.99'), Product.APPROVED, globex, created_users['globex_admin'],
             'https://picsum.photos/seed/device/600/400'),
            ('Smart Sensor', 'IoT-ready smart sensor with real-time analytics dashboard and cloud connectivity.',
             Decimal('39.99'), Product.APPROVED, acme, created_users['acme_admin'],
             'https://picsum.photos/seed/sensor/600/400'),
            ('Power Hub', 'Central power management hub for your entire office. Energy-efficient and smart-grid compatible.',
             Decimal('149.99'), Product.APPROVED, globex, created_users['globex_admin'],
             'https://picsum.photos/seed/powerhub/600/400'),
            ('CloudSync Box', 'Automatic cloud synchronization appliance. Set it and forget it — your data, everywhere.',
             Decimal('79.99'), Product.APPROVED, acme, created_users['acme_editor'],
             'https://picsum.photos/seed/cloudsync/600/400'),
            ('Nano Tracker', 'Ultra-compact asset tracker with 6-month battery life and global coverage.',
             Decimal('19.99'), Product.PENDING_APPROVAL, globex, created_users['globex_admin'],
             'https://picsum.photos/seed/tracker/600/400'),
        ]

        for name, desc, price, st, business, creator, image_url in products_data:
            Product.objects.get_or_create(
                name=name,
                business=business,
                defaults={
                    'description': desc,
                    'price': price,
                    'status': st,
                    'image_url': image_url,
                    'created_by': creator,
                },
            )

        self.stdout.write(self.style.SUCCESS('Products created'))
        self.stdout.write(self.style.SUCCESS('Seed data loaded successfully!'))
